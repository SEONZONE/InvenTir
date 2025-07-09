import Link from 'next/link';

const GNB = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-lg font-bold">
          자재 관리 시스템
        </Link>
        <div className="flex space-x-4">
          <Link href="/select" className="text-gray-300 hover:text-white">
            프로젝트 생성
          </Link>
          <Link href="/categoryCode" className="text-gray-300 hover:text-white">
            분류 코드 관리
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default GNB;
