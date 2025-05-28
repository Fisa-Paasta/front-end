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
  isLoading: boolean; // ✅ 로딩 상태 추가
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 전역 타이머
let logoutTimer: ReturnType<typeof setTimeout>;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ 초기 로딩 상태

  const logout = () => {
    console.log('⏱️ 자동 로그아웃 또는 수동 로그아웃');
    localStorage.clear();
    setUserState(null);
    if (logoutTimer) clearTimeout(logoutTimer);
    window.location.href = '/init';
  };

  const setUser = (user: AuthUser | null) => {
    setUserState(user);
    if (user) startInactivityTimer();
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

  // ✅ 초기 인증 상태 복구 (새로고침 대응)
  useEffect(() => {
    const restoreAuthState = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        const storedUserName = localStorage.getItem('userName');
        const storedRole = localStorage.getItem('role') as Role | null;

        // ✅ 로컬 스토리지에 정보가 있으면 일단 복원
        if (storedToken && storedUserId && storedUserName && storedRole) {
          console.log('🔄 로그인 상태 복원 중...');
          
          // ✅ 임시 토큰은 검증 없이 바로 복원
          if (storedToken === 'test-user-token' || storedToken === 'test-admin-token' || storedToken.startsWith('mock-jwt-token-')) {
            setUserState({
              userId: storedUserId,
              userName: storedUserName,
              role: storedRole,
            });
            startInactivityTimer();
            console.log('✅ 임시 토큰으로 로그인 상태 복원 완료');
            return;
          }

          // ✅ 실제 토큰은 서버 검증
          try {
            const res = await fetch('http://localhost:8080/api/verify-token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${storedToken}`,
              },
            });

            if (res.ok) {
              setUserState({
                userId: storedUserId,
                userName: storedUserName,
                role: storedRole,
              });
              startInactivityTimer();
              console.log('✅ 서버 검증 후 로그인 상태 복원 완료');
            } else {
              console.warn('⚠️ 토큰 검증 실패, 로그아웃 처리');
              localStorage.clear();
            }
          } catch (err) {
            console.warn('⚠️ 서버 연결 실패, 임시로 로컬 상태 유지');
            // ✅ 서버 연결 실패 시에도 로컬 상태 유지 (오프라인 대응)
            setUserState({
              userId: storedUserId,
              userName: storedUserName,
              role: storedRole,
            });
            startInactivityTimer();
          }
        }
      } catch (err) {
        console.error('❌ 인증 상태 복원 실패:', err);
      } finally {
        setIsLoading(false); // ✅ 로딩 완료
      }
    };

    restoreAuthState();
  }, []);

  // ✅ 비활동 이벤트 감지
  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click'];
    events.forEach((e) => window.addEventListener(e, resetInactivityTimer));

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetInactivityTimer));
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};