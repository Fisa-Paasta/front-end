import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const [dashboards, setDashboards] = useState([
    { id: 1, title: '1번째 이미지', desc: '서버 대시보드 설명이 들어갑니다.', date: '2022.09.19', starred: true },
    { id: 2, title: '2번째 이미지', desc: '서버 대시보드 설명이 들어갑니다.', date: '2022.09.19', starred: false },
    { id: 3, title: '3번째 이미지', desc: '서버 대시보드 설명이 들어갑니다.', date: '2022.09.19', starred: false },
    { id: 4, title: '4번째 이미지', desc: '서버 대시보드 설명이 들어갑니다.', date: '2022.09.19', starred: false },
    { id: 6, title: '6번째 이미지', desc: '서버 대시보드 설명이 들어갑니다.', date: '2022.09.19', starred: false },
  ]);

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white text-base">
      <div className="w-full bg-[#1a1a2e] text-white shadow-md px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src="src/assets/logo.png" alt="Paasta" className="h-8 w-auto" />
          <span className="text-xl font-bold">Paasta</span>
        </Link>
        <div className="flex items-center space-x-6">
          <nav className="flex space-x-6 text-base font-medium">
            <Link to="/news" className="text-gray-300 hover:text-white">목록</Link>
            <Link to="/survey" className="text-gray-300 hover:text-white">모니터링</Link>
            <Link to="/list" className="text-gray-300 hover:text-white">비용산정</Link>
            <Link to="/mypage" className="text-gray-300 hover:text-white">마이페이지</Link>
          </nav>
          <Link
            to="/login"
            className="px-5 py-2 text-base bg-blue-500 text-white rounded hover:bg-blue-600 transition font-semibold"
          >
            로그인
          </Link>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-[#151520] p-6 text-gray-300 text-base">
          <div className="text-sm mb-4 uppercase tracking-wide text-gray-500 font-semibold">메뉴</div>
          <nav className="space-y-4 text-base">
            <Link to="/" className="block hover:text-white font-medium">🏠 홈</Link>
            <Link to="/settings" className="block hover:text-white font-medium">⚙️ 설정</Link>
            <Link to="/support" className="block hover:text-white font-medium">📩 피드백</Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-10">
          <h1 className="text-3xl font-bold mb-8">대시보드 리스트</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
            {dashboards.map((item) => (
              <div key={item.id} className="bg-[#1a1a2e] rounded-xl p-5 text-white text-base">
                <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md mb-4"></div>
                <h2 className="text-lg font-semibold mb-1">{item.title}</h2>
                <p className="text-sm text-gray-400 mb-2">{item.desc}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{item.date}</span>
                  <div>{item.starred ? '⭐' : '⋯'}</div>
                </div>
              </div>
            ))}
            {/* Add New Card */}
            <div className="bg-[#1a1a2e] rounded-xl flex items-center justify-center text-4xl text-gray-500 cursor-pointer hover:bg-[#2a2a3e]">
              +
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}