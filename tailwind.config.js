/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // 🌙 class 기반 다크모드
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 🌗 배경 색상
        background: {
          light: '#f5f6fa',  // 기본 라이트 배경
          dark: '#0e0f1a',   // 기본 다크 배경
          card: '#2a2a40',   // 카드/섹션 배경 (optional)
        },

        // 🟦 패널 (카드형 박스 배경)
        panel: {
          light: '#ffffff',   // 패널 기본
          dark: '#1f1f2f',    // 다크 패널 (더 깊은 색감)
        },

        // 🔲 테두리
        border: {
          light: '#e2e2e2',
          dark: '#4b5563',
        },

        // 🎨 텍스트
        foreground: {
          light: '#1f1f1f',  // 본문 검정
          dark: '#e0e0e0',   // 본문 흰색
        },

        // 🔵 주요 색상
        primary: {
          DEFAULT: '#7c3aed',  // 보라 버튼
          hover: '#9333EA',    // hover 시 밝은 보라
        },

        // 🔘 입력 필드
        input: {
          light: '#f4f4f4',
          dark: '#1a1a2e',
        },
      },
    },
  },
  plugins: [],
};
