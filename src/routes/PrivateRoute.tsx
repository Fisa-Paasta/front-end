import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { ReactNode } from 'react';

interface PrivateRouteProps {
  readonly children: ReactNode;
  readonly requiredRole?: 'admin' | 'user';
}

export default function PrivateRoute({ children, requiredRole }: PrivateRouteProps) {
  const { user } = useAuth();
  const location = useLocation();

  // 1. 로그인되지 않은 경우 → /init
  if (!user) {
    return <Navigate to="/init" replace />;
  }

  // 2. 권한 부족한 경우
  if (requiredRole && user.role !== requiredRole) {
    // 관리자 페이지 접근 시
    if (location.pathname.startsWith('/admin')) {
      alert('⚠️ 관리자 권한이 필요합니다. 홈으로 이동합니다.');
      return <Navigate to="/home" replace />;
    }

    // 그 외 접근 제한
    return <Navigate to="/home" replace />;
  }

  // 통과
  return <>{children}</>;
}
