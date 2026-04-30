import { create } from 'zustand'

function readHash() {
  const h = window.location.hash || '#/'
  // strip leading #
  return h.replace(/^#/, '') || '/'
}

export const useRouter = create((set) => {
  if (typeof window !== 'undefined') {
    window.addEventListener('hashchange', () => {
      set({ path: readHash() })
    })
  }
  return {
    path: typeof window !== 'undefined' ? readHash() : '/',
    navigate: (to) => {
      window.location.hash = to.startsWith('/') ? to : `/${to}`
    },
  }
})
