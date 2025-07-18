import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from "next/server";

export async function POST(request) {
  const { projectName, projectDuration, materials } = await request.json();

  // 필수 데이터 검증
  if (
    !projectName ||
    !projectDuration ||
    !materials ||
    materials.length === 0
  ) {
    return NextResponse.json(
      { message: "Project name, duration, and materials are required." },
      { status: 400 }
    );
  }

  try {
    // 1. PROJECTS 테이블에 프로젝트 정보 삽입
    const { data: projectData, error: projectError } = await supabase
      .from('PROJECTS')
      .insert([
        {
          project_name: projectName,
          start_date: projectDuration.split("~")[0].trim(),
          end_date: projectDuration.split("~")[1].trim(),
        },
      ])
      .select();

    if (projectError) throw projectError;

    const projectId = projectData[0].project_id;

    // 2. 각 자재 정보를 PROJECT_MATERIALS 테이블에 삽입
    const materialData = materials.map((material) => ({
      project_id: projectId,
      category_code_id: material.category_code_id,
      material_quantity: material.material_quantity,
      material_unit_price: material.material_unit_price,
      labor_quantity: material.labor_quantity,
      labor_unit_price: material.labor_unit_price,
      expenses_quantity: material.expenses_quantity,
      expenses_unit_price: material.expenses_unit_price,
    }));

    const { error: materialError } = await supabase
      .from('PROJECT_MATERIALS')
      .insert(materialData);

    if (materialError) throw materialError;

    return NextResponse.json(
      { message: "Project and materials saved successfully", projectId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase.from('PROJECTS').select('*');
    if (error) {
      throw error;
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
