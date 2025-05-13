import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [dashboards, setDashboards] = useState([
    { id: 1, title: '1번째 이미지', desc: '서버 대시보드 설명이 들어갑니다.', date: '2022.09.19', starred: true, status: '접수중' },
    { id: 2, title: '2번째 이미지', desc: '서버 대시보드 설명이 들어갑니다.', date: '2022.09.19', starred: true, status: '승인완료' },
    { id: 3, title: '3번째 이미지', desc: '서버 대시보드 설명이 들어갑니다.', date: '2022.09.19', starred: true, status: '구축중' },
    { id: 4, title: '4번째 이미지', desc: '서버 대시보드 설명이 들어갑니다.', date: '2022.09.19', starred: true, status: '구축완료' },
    { id: 6, title: '6번째 이미지', desc: '서버 대시보드 설명이 들어갑니다.', date: '2022.09.19', starred: true, status: '접수완료' },
  ]);

  const navigate = useNavigate();
  const [sortType, setSortType] = useState('date');

  const toggleStar = (id) => {
    setDashboards(prev =>
      prev.map(card =>
        card.id === id ? { ...card, starred: !card.starred } : card
      )
    );
  };

  const statusPriority = {
    '접수중': 1,
    '접수완료': 2,
    '승인처리중': 3,
    '승인완료': 4,
    '구축중': 5,
    '구축완료': 6,
  };

  const sortDashboards = (list) => {
    return list.sort((a, b) => {
      if (sortType === 'title') return a.title.localeCompare(b.title);
      if (sortType === 'status') return statusPriority[a.status] - statusPriority[b.status];
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  };

  const getStatusColor = (status) => {
    const map = {
      '접수중': 'bg-yellow-500 text-black',
      '접수완료': 'bg-green-600 text-white',
      '승인처리중': 'bg-blue-500 text-white',
      '승인완료': 'bg-blue-700 text-white',
      '구축중': 'bg-purple-500 text-white',
      '구축완료': 'bg-gray-500 text-white'
    };
    return map[status] || 'bg-white text-black';
  };

  const starredDashboards = sortDashboards(dashboards.filter(d => d.starred));
  const normalDashboards = sortDashboards(dashboards.filter(d => !d.starred));

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white text-[15px]">
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
        <aside className="w-64 bg-[#151520] p-6 text-gray-300 text-base">
          <div className="text-sm mb-4 uppercase tracking-wide text-gray-500 font-semibold">메뉴</div>
          <nav className="space-y-4 text-base">
            <Link to="/" className="block hover:text-white font-medium">🏠 홈</Link>
            <Link to="/settings" className="block hover:text-white font-medium">⚙️ 설정</Link>
            <Link to="/support" className="block hover:text-white font-medium">📩 피드백</Link>
          </nav>
        </aside>

        <main className="flex-1 p-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">대시보드</h2>
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="bg-[#2a2a3e] text-white text-sm rounded px-3 py-2 border-none outline-none shadow"
            >
              <option value="date">📅 최신순</option>
              <option value="title">🔤 제목순</option>
              <option value="status">📌 상태순</option>
            </select>
          </div>

          {starredDashboards.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-4">⭐ 즐겨찾기 대시보드</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {starredDashboards.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#1a1a2e] hover:bg-[#252538] transition rounded-xl p-5 text-white text-base cursor-pointer"
                  >
                    <div className="relative h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md mb-4" />
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-base font-semibold">{item.title}</h2>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>{item.status}</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{item.desc}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{item.date}</span>
                      <button onClick={() => toggleStar(item.id)} className="hover:scale-110 transition-transform outline-none focus:outline-none">
                        {item.starred ? '⭐' : '☆'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <h1 className="text-2xl font-bold mb-8">대시보드 리스트</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {normalDashboards.map((item) => (
              <div
                key={item.id}
                className="bg-[#1a1a2e] hover:bg-[#252538] transition rounded-xl p-5 text-white text-base cursor-pointer"
              >
                <div className="relative h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md mb-4" />
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-base font-semibold">{item.title}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>{item.status}</span>
                </div>
                <p className="text-sm text-gray-400 mb-2">{item.desc}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{item.date}</span>
                  <button onClick={() => toggleStar(item.id)} className="hover:scale-110 transition-transform outline-none focus:outline-none">
                    {item.starred ? '⭐' : '☆'}
                  </button>
                </div>
              </div>
            ))}
            <div
              onClick={() => navigate('/survey')}
              className="min-h-[160px] bg-[#1a1a2e] rounded-xl flex items-center justify-center text-4xl text-gray-500 cursor-pointer hover:bg-[#2a2a3e]"
            >
              +
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}