import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

type Role = 'admin' | 'user';

interface AuthUser {
  userId: string;
  userName: string;
  role: Role;
}

interface AuthContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 전역 타이머
let logoutTimer: ReturnType<typeof setTimeout>;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<AuthUser | null>(null);

  const logout = () => {
    console.log('⏱️ 자동 로그아웃 또는 수동 로그아웃');
    localStorage.clear();
    setUserState(null);
    window.location.href = '/init';
  };

  const setUser = (user: AuthUser | null) => {
    setUserState(user);
    if (user) startInactivityTimer(); // 로그인 시 타이머 시작
  };

  const startInactivityTimer = () => {
    if (logoutTimer) clearTimeout(logoutTimer);
    logoutTimer = setTimeout(() => {
      alert('15분 동안 활동이 없어 자동 로그아웃되었습니다.');
      logout();
    }, 15 * 60 * 1000); // 15분
  };

  const resetInactivityTimer = () => {
    if (user) startInactivityTimer();
  };

  // ✅ 1. 로그인 상태 복구 + 서버 인증 확인
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    const storedRole = localStorage.getItem('role') as Role | null;

    const restoreAndVerify = async () => {
      if (storedToken && storedUserId && storedUserName && storedRole) {
        try {
          const res = await fetch('http://localhost:8080/api/verify-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (!res.ok) throw new Error('토큰 검증 실패');

          setUserState({
            userId: storedUserId,
            userName: storedUserName,
            role: storedRole,
          });

          startInactivityTimer();
        } catch (err) {
          console.error('❌ 인증 실패:', err);
          logout();
        }
      }
    };

    restoreAndVerify();
  }, []);

  // ✅ 2. 비활동 이벤트 감지
  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click'];
    events.forEach((e) => window.addEventListener(e, resetInactivityTimer));

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetInactivityTimer));
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
