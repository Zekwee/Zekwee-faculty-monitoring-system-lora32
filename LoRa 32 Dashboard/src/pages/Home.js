export default function Home() {
  return `
    <div class="min-h-screen flex items-center justify-center">
      <div class="bg-white p-6 rounded shadow text-center">
        <h1 class="text-2xl font-bold">🚀 XUI Framework</h1>
        <p class="mt-2 text-gray-600">PWA • Firebase • Tailwind</p>
        
        <div class="mt-4 text-sm text-gray-500">
          Render time: <span id="render-time">...</span>
        </div>
      </div>
    </div>
  `;
}