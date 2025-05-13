import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Lock, User, Building2, Sparkles } from 'lucide-react';

const slogans: JSX.Element[] = [
  <>빠르게 시작하는 <strong className="text-white">PaaS 환경</strong></>,
  <>사내 <strong className="text-white">인프라 자동화</strong>를 한눈에</>,
  <>DevSecOps <strong className="text-white">Ready</strong>. Enterprise <strong className="text-white">Secure</strong>.</>,
  <>구축부터 운영까지 <strong className="text-white">원스톱 제공</strong></>,
  <><span className="mr-1">☁️</span> <strong>클라우드 기반</strong> 인프라 신청</>,
  <><span className="mr-1">🧩</span> <strong>자동화된</strong> 배포 구성</>,
  <><span className="mr-1">🔒</span> <strong>금융권 보안 기준</strong> 준수</>,
  <><span className="mr-1">📊</span> <strong>실시간 모니터링</strong> & 로깅 제공</>
];

type FormField = 'id' | 'password' | 'department';

export default function InitPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<Record<FormField, string>>({ id: '', password: '', department: '' });
  const [currentSloganIndex, setCurrentSloganIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSloganIndex((prev) => (prev + 1) % slogans.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name as FormField]: value }));
  };

  const handleLogin = () => {
    if (form.id && form.password && form.department) {
      localStorage.setItem('token', 'mock-token');
      navigate('/');
    } else {
      alert('모든 항목을 입력해주세요.');
    }
  };

  return (
    <div className="flex h-screen text-white">
      {/* Left Side with slogan */}
      <div className="w-[40%] bg-gradient-to-br from-purple-600 to-indigo-700 flex flex-col justify-center items-center px-12 space-y-10">
        <img src="src/assets/logo.png" alt="Paasta 로고" className="w-28 h-28 drop-shadow-lg" />
        <h1 className="text-5xl font-bold">Paasta</h1>
        <p className="text-lg font-medium text-white/90 text-center transition-all duration-500 ease-in-out">
          {slogans[currentSloganIndex]}
        </p>
      </div>

      {/* Right Side with Form */}
      <div className="w-[60%] bg-[#0f0f1a] flex justify-center items-center px-8">
        <div className="bg-[#1b1b2f] text-white rounded-2xl shadow-xl p-10 w-full max-w-2xl">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-purple-400">
              <Sparkles className="w-6 h-6" /> Paasta에 오신 걸 환영합니다!
            </h2>
            <p className="text-base text-gray-400 mt-3 leading-relaxed">
              <strong className="text-white">Paasta</strong>는 사내 <strong className="text-white">PaaS 환경</strong>을 손쉽게 조리하듯 구축하고,
              누구나 쉽게 운영할 수 있도록 돕는 플랫폼입니다.
              <br />아래 정보를 입력하여 서비스를 시작해보세요.
            </p>
          </div>

          <div className="space-y-4">
            {/* Input Fields */}
            <div className="flex items-center bg-[#1f1f2e] rounded-md px-4 py-3">
              <User className="w-5 h-5 text-gray-400 mr-3" />
              <input name="id" type="text" placeholder="사번" value={form.id} onChange={handleChange}
                className="bg-transparent outline-none text-base w-full placeholder-gray-400 text-white" />
            </div>
            <div className="flex items-center bg-[#1f1f2e] rounded-md px-4 py-3">
              <Lock className="w-5 h-5 text-gray-400 mr-3" />
              <input name="password" type="password" placeholder="비밀번호" value={form.password} onChange={handleChange}
                className="bg-transparent outline-none text-base w-full placeholder-gray-400 text-white" />
            </div>
            <div className="flex items-center bg-[#1f1f2e] rounded-md px-4 py-3">
              <Building2 className="w-5 h-5 text-gray-400 mr-3" />
              <input name="department" type="text" placeholder="부서" value={form.department} onChange={handleChange}
                className="bg-transparent outline-none text-base w-full placeholder-gray-400 text-white" />
            </div>

            <button
              onClick={handleLogin}
              className="bg-purple-600 hover:brightness-110 focus:ring-2 focus:ring-purple-400 transition-all duration-200 ease-in-out w-full py-3 rounded-md text-white font-semibold text-lg"
            >
              로그인
            </button>
          </div>

          <p className="text-sm text-gray-500 text-center mt-8">
            © 2025 PAASTA Cloud Platform
          </p>
        </div>
      </div>
    </div>
  );
}