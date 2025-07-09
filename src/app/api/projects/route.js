import pool, { executeQuery } from '@/lib/db'; // pool과 executeQuery 모두 import
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { projectName, projectDuration, materials } = await request.json();

  let connection;
  try {
    connection = await pool.getConnection(); // pool에서 connection 가져오기
    await connection.beginTransaction(); // 트랜잭션 시작

    // PROJECTS 테이블에 프로젝트 정보 삽입
    const [projectResult] = await connection.execute(
      'INSERT INTO PROJECTS (project_name, start_date, end_date) VALUES (?, ?, ?)',
      [projectName, projectDuration.split('~')[0].trim(), projectDuration.split('~')[1].trim()]
    );
    const projectId = projectResult.insertId;

    // PROJECT_MATERIALS 테이블에 자재 정보 삽입
    for (const material of materials) {
      // MATERIALS 테이블에 자재 정보 삽입 (중복 방지 또는 기존 자재 사용 로직 필요)
      // 여기서는 간단하게 매번 새로 삽입하는 것으로 가정합니다.
      // 실제 애플리케이션에서는 기존 자재가 있는지 확인하고 있다면 해당 material_id를 사용해야 합니다.
      const [materialResult] = await connection.execute(
        'INSERT INTO MATERIALS (process, product, unit, quantity, material_unit_cost, labor_unit_cost, expenses_unit_cost) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          material.category,
          material.subCategory,
          material.unit,
          material.quantity,
          material.unitPrice1,
          material.unitPrice2,
          material.unitPrice3,
        ]
      );
      const materialId = materialResult.insertId;

      await connection.execute(
        'INSERT INTO PROJECT_MATERIALS (project_id, material_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [projectId, materialId, material.quantity, material.totalPrice]
      );
    }

    await connection.commit(); // 트랜잭션 커밋
    return NextResponse.json({ message: 'Project and materials saved successfully', projectId }, { status: 201 });
  } catch (error) {
    if (connection) {
      await connection.rollback(); // 오류 발생 시 롤백
    }
    console.error('Error saving project and materials:', error);
    return NextResponse.json({ message: 'Error saving project and materials', error: error.message }, { status: 500 });
  } finally {
    if (connection) {
      connection.release(); // 연결 반환
    }
  }
}