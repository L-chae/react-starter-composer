import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language, Styling, LibraryId, ComposerSelection } from '../types/composer';
import { sanitizeProjectName } from '../utils/sanitizeProjectName';

interface ComposerState {
  projectName: string;
  language: Language;
  styling: Styling;
  selectedLibraries: Record<LibraryId, boolean>;
  
  setProjectName: (name: string) => void;
  setLanguage: (lang: Language) => void;
  setStyling: (styling: Styling) => void;
  toggleLibrary: (libId: LibraryId) => void;
  reset: () => void;
  getSelection: () => ComposerSelection;
}

const initialState = {
  projectName: 'my-react-app',
  language: 'ts' as Language,
  styling: 'css' as Styling,
  selectedLibraries: {
    vitest: false,
    zustand: false,
    lucide: false,
    prettier: false,
  },
};

// persist 미들웨어로 스토어 래핑
export const useComposerStore = create<ComposerState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setProjectName: (projectName) => set({ projectName }),
      setLanguage: (language) => set({ language }),
      setStyling: (styling) => set({ styling }),
      
      toggleLibrary: (libId) => set((state) => ({
        selectedLibraries: {
          ...state.selectedLibraries,
          [libId]: !state.selectedLibraries[libId]
        }
      })),

      reset: () => set(initialState),

      getSelection: () => {
        const state = get();
        const activeLibs = Object.entries(state.selectedLibraries)
          .filter((entry) => entry[1])
          .map((entry) => entry[0] as LibraryId);

        return {
          projectName: sanitizeProjectName(state.projectName),
          language: state.language,
          styling: state.styling,
          selectedLibraries: activeLibs,
        };
      }
    }),
    {
      name: 'composer-storage', // LocalStorage에 저장될 키 이름
      // 저장할 상태만 필터링 (메서드는 제외)
      partialize: (state) => ({
        projectName: state.projectName,
        language: state.language,
        styling: state.styling,
        selectedLibraries: state.selectedLibraries,
      }),
    }
  )
);