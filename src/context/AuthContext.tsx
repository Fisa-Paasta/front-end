import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
  useCallback,
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
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 전역 타이머
let logoutTimer: ReturnType<typeof setTimeout>;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    console.log('⏱️ 자동 로그아웃 또는 수동 로그아웃');
    localStorage.clear();
    setUser(null);
    if (logoutTimer) clearTimeout(logoutTimer);
    window.location.href = '/init';
  }, []);

  const startInactivityTimer = useCallback(() => {
    if (logoutTimer) clearTimeout(logoutTimer);
    logoutTimer = setTimeout(() => {
      alert('15분 동안 활동이 없어 자동 로그아웃되었습니다.');
      logout();
    }, 15 * 60 * 1000); // 15분
  }, [logout]);

  const handleSetUser = useCallback((newUser: AuthUser | null) => {
    setUser(newUser);
    if (newUser) startInactivityTimer();
  }, [startInactivityTimer]);

  const resetInactivityTimer = useCallback(() => {
    if (user) startInactivityTimer();
  }, [user, startInactivityTimer]);

  // 토큰 검증 로직 분리
  const verifyTokenWithServer = useCallback(async (token: string): Promise<boolean> => {
    try {
      const res = await fetch('https://api.paasta.store/api/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return res.ok;
    } catch {
      console.warn('⚠️ 서버 연결 실패, 임시로 로컬 상태 유지');
      return true; // 서버 연결 실패 시에도 로컬 상태 유지 (오프라인 대응)
    }
  }, []);

  // 인증 상태 복원 로직 분리
  const restoreAuthState = useCallback(async () => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    const storedRole = localStorage.getItem('role') as Role | null;

    if (!storedToken || !storedUserId || !storedUserName || !storedRole) {
      return;
    }

    console.log('🔄 로그인 상태 복원 중...');
    
    // 임시 토큰은 검증 없이 바로 복원
    if (storedToken === 'test-user-token' || 
        storedToken === 'test-admin-token' || 
        storedToken.startsWith('mock-jwt-token-')) {
      setUser({
        userId: storedUserId,
        userName: storedUserName,
        role: storedRole,
      });
      startInactivityTimer();
      console.log('✅ 임시 토큰으로 로그인 상태 복원 완료');
      return;
    }

    // 실제 토큰은 서버 검증
    const isValid = await verifyTokenWithServer(storedToken);
    if (isValid) {
      setUser({
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
  }, [startInactivityTimer, verifyTokenWithServer]);

  // 초기 인증 상태 복구 (새로고침 대응)
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await restoreAuthState();
      } catch (err) {
        console.error('❌ 인증 상태 복원 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    void initializeAuth();
  }, [restoreAuthState]);

  // 비활동 이벤트 감지
  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click'];
    events.forEach((e) => window.addEventListener(e, resetInactivityTimer));

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetInactivityTimer));
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, [resetInactivityTimer]);

  const contextValue = useMemo(() => ({
    user,
    setUser: handleSetUser,
    logout,
    isLoading,
  }), [user, handleSetUser, logout, isLoading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};