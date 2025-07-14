import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { projectName, projectDuration, materials } = await request.json();

  // 필수 데이터 검증
  if (!projectName || !projectDuration || !materials || materials.length === 0) {
    return NextResponse.json({ message: 'Project name, duration, and materials are required.' }, { status: 400 });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction(); // 트랜잭션 시작

    // 1. PROJECTS 테이블에 프로젝트 정보 삽입
    const [projectResult] = await connection.execute(
      'INSERT INTO PROJECTS (project_name, start_date, end_date) VALUES (?, ?, ?)',
      [projectName, projectDuration.split('~')[0].trim(), projectDuration.split('~')[1].trim()]
    );
    const projectId = projectResult.insertId;

    // 2. 각 자재 정보를 PROJECT_MATERIALS 테이블에 삽입
    for (const material of materials) {
      // 프론트엔드에서 올바른 데이터를 보내는지 확인
      if (material.category_code_id == null || 
          material.material_quantity == null || material.material_unit_price == null ||
          material.labor_quantity == null || material.labor_unit_price == null ||
          material.expenses_quantity == null || material.expenses_unit_price == null) {
        throw new Error('Incomplete material data received for project materials.');
      }
      
      await connection.execute(
        `INSERT INTO PROJECT_MATERIALS (
          project_id, category_code_id,
          material_quantity, material_unit_price,
          labor_quantity, labor_unit_price,
          expenses_quantity, expenses_unit_price
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ,
        [
          projectId,
          material.category_code_id,
          material.material_quantity,
          material.material_unit_price,
          material.labor_quantity,
          material.labor_unit_price,
          material.expenses_quantity,
          material.expenses_unit_price,
        ]
      );
    }

    await connection.commit(); // 모든 쿼리가 성공하면 트랜잭션 커밋
    
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