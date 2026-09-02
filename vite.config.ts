import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' 로 두면 GitHub Pages(프로젝트 페이지) 하위 경로에서도 에셋이 정상 로드됩니다.
export default defineConfig({
  base: './',
  plugins: [react()],
})
