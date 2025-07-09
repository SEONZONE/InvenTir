// src/app/materialList/page.js
'use client';

import { useRouter } from 'next/navigation';

export default function ProjectListPage() {
  const router = useRouter();

  const handleCreateProject = () => {
    router.push('/select');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">프로젝트 목록</h1>
      <p className="mb-4">여기에 프로젝트 목록이 표시될 예정입니다.</p>
      <button
        onClick={handleCreateProject}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        프로젝트 생성
      </button>
    </div>
  );
}
