import { supabase } from "@/lib/supabaseClient";
import ProjectForm from "@/src/component/ui/ProjectForm";
import Link from 'next/link';

export default async function ProjectDetailPage({ params }) {
  const { id } = params;
  const { data: project, error } = await supabase
    .from("PROJECTS")
    .select(
      `
            *,
            PROJECT_MATERIALS(
                *,
                CATEGORY_CODE ( name, unit )
            )
            `
    )
    .eq("project_id", id)
    .single();
    console.log(JSON.stringify(project))
    const addedItems = project.PROJECT_MATERIALS
    let totalPrice = 0;
    for(const item of project.PROJECT_MATERIALS){
      totalPrice+=item.total_cost
    }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{project.project_name ? project.project_name  : "제목없는 프로젝트"}</h1>
      <ProjectForm initialData={project} />

      <h2 className="text-xl font-bold mb-4">추가된 자재 목록</h2>
      {addedItems.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="th-base">공정</th>
                <th className="th-base">품명</th>
                <th className="th-base">수량</th>
                <th className="th-base">재료비(단가)</th>
                <th className="th-base">노무비(단가)</th>
                <th className="th-base">경비(단가)</th>
                <th className="th-base">전체 합산</th>
              </tr>
            </thead>
            <tbody>
              {addedItems.map((item) => (
                <tr key={item.temp_id}>
                  <td className="border-base">{item.CATEGORY_CODE.name}</td>
                  <td className="border-base">{item.CATEGORY_CODE.unit}</td>
                  <td className="border-base">{item.material_quantity}</td>
                  <td className="border-base text-center">{`${item.material_unit_price.toLocaleString("ko-KR")}원`}</td>
                  <td className="border-base text-center">{`${item.labor_unit_price.toLocaleString("ko-KR")}원`}</td>
                  <td className="border-base text-center">{`${item.expenses_unit_price.toLocaleString("ko-KR")}원`}</td>
                  <td className="border-base text-right">{`${item.total_cost.toLocaleString("ko-KR")}원`}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end items-center p-4 font-bold text-lg">
            <span>총합계:</span>
            <span className="ml-2">{totalPrice.toLocaleString("ko-KR")}원</span>
          </div>
        </div>
      )}
      <div className="mt-8 flex justify-end">
        <Link href="/projectList" className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          목록으로
        </Link>
      </div>
    </div>
  );
}
