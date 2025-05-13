import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Lock, User, Building2, Sparkles } from 'lucide-react';

type FormField = 'id' | 'password' | 'department';

export default function InitPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<Record<FormField, string>>({ id: '', password: '', department: '' });

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
      {/* Left Side with Logo */}
      <div className="w-1/2 bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <img src="src\assets\logo.png" alt="Paasta 로고" className="w-20 h-20" />
          <h1 className="text-4xl font-bold">Paasta</h1>
        </div>
      </div>

      {/* Right Side with Form */}
      <div className="w-1/2 bg-[#0f0f1a] flex flex-col justify-center px-20">
      <div className="mb-10">
          <h2 className="text-2xl font-semibold flex items-center gap-2 text-purple-400">
            <Sparkles className="w-5 h-5" /> 안녕하세요!!!
          </h2>
          <p className="text-sm text-gray-400 mt-2 leading-relaxed">
            <strong className="text-white">Paasta</strong>는 사내 <strong className="text-white">PaaS 환경</strong>을 손쉽게 조리하듯 구축하고 운영할 수 있도록 돕는 플랫폼입니다.
            <br />아래 정보를 입력하여 서비스를 시작해보세요.
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center bg-[#1e1e2f] rounded px-3 py-2">
            <User className="w-4 h-4 text-gray-400 mr-2" />
            <input
              name="id"
              type="text"
              placeholder="사번"
              value={form.id}
              onChange={handleChange}
              className="bg-transparent outline-none text-sm w-full placeholder-gray-400"
            />
          </div>
          <div className="flex items-center bg-[#1e1e2f] rounded px-3 py-2">
            <Lock className="w-4 h-4 text-gray-400 mr-2" />
            <input
              name="password"
              type="password"
              placeholder="비밀번호"
              value={form.password}
              onChange={handleChange}
              className="bg-transparent outline-none text-sm w-full placeholder-gray-400"
            />
          </div>
          <div className="flex items-center bg-[#1e1e2f] rounded px-3 py-2">
            <Building2 className="w-4 h-4 text-gray-400 mr-2" />
            <input
              name="department"
              type="text"
              placeholder="부서"
              value={form.department}
              onChange={handleChange}
              className="bg-transparent outline-none text-sm w-full placeholder-gray-400"
            />
          </div>
          <button
            onClick={handleLogin}
            className="bg-purple-600 hover:bg-purple-700 transition w-full py-2 rounded font-semibold"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}
