// src/components/Layout.tsx
import { useState, ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  collapsed?: boolean;
  setCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Layout({ children, collapsed, setCollapsed }: LayoutProps) {
  // 외부 props가 없으면 내부 상태 사용 (uncontrolled)
  const [internalCollapsed, internalSetCollapsed] = useState(false);
  const isControlled = collapsed !== undefined && setCollapsed !== undefined;

  const effectiveCollapsed = isControlled ? collapsed : internalCollapsed;
  const effectiveSetCollapsed = isControlled ? setCollapsed : internalSetCollapsed;

  return (
    <div className="relative bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark min-h-screen">
      <Header />
      <Sidebar collapsed={effectiveCollapsed} setCollapsed={effectiveSetCollapsed} />

      <main
        className={`
          pt-[120px]  // ⬅️ header + margin
          transition-all duration-300
          overflow-y-auto
          ${effectiveCollapsed ? 'pl-20' : 'pl-64'}
          pr-6 md:pr-10 pb-10
          min-h-[calc(100vh-4rem)]
        `}
      >
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
          {children}
        </div>
      </main>
    </div>
  );
}
