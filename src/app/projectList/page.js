'use client';

import { useRouter } from 'next/navigation';
import { useEffect,useState } from 'react';
import { formatDate,formatTime,formatWon } from "@/lib/helpers";

export default function ProjectListPage() {
  const router = useRouter();
  const handleCreateProject = () => {
    router.push('/select');
  };
  const [projectsData, setProjectsData] = useState([]);

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      setProjectsData(await response.json());
    } catch (error) {
      console.error("Failed to load project list:", error);
    }
  };
  console.log(JSON.stringify(projectsData[0]))
  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">프로젝트 목록</h1>

      <div className="mb-4 text-right">
        <button
          onClick={handleCreateProject}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          프로젝트 생성
        </button>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="th-base">프로젝트명</th>
              <th className="th-base">고객명</th>
              <th className="th-base">시작일</th>
              <th className="th-base">종료일</th>
              <th className="th-base">상태</th>
              <th className="th-base">설명</th>
              <th className="th-base">총예산</th>
              <th className="th-base">생성일</th>
              <th className="th-base">수정일</th>
            </tr>
          </thead>
          <tbody>
              {projectsData.map((item) => (
               <tr key={item.project_id}>
                <td className="border-base">{item.project_name}</td>
                <td className="border-base">{item.client_name}</td>
                <td className="border-base">{formatDate(item.start_date)}</td>
                <td className="border-base">{formatDate(item.end_date)}</td>
                <td className="border-base">{item.status}</td>
                <td className="border-base">{item.description}</td>
                <td className="border-base text-right">{formatWon(item.budget)}</td>
                <td className="border-base">{formatTime(item.created_at)}</td>
                <td className="border-base">{formatTime(item.updated_at)}</td>
              </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}