import React, { createContext, useContext, useEffect, useState } from 'react';

type Role = 'admin' | 'user';

interface AuthUser {
  userId: string;
  userName: string;
  role: Role;
}

interface AuthContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  // ✅ localStorage → user 상태 초기화
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    const storedRole = localStorage.getItem('role') as Role | null;

    if (storedUserId && storedUserName && storedRole) {
      setUser({
        userId: storedUserId,
        userName: storedUserName,
        role: storedRole,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
