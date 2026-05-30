import { create } from "zustand";
import type {
  Language,
  Styling,
  LibraryId,
  ComposerSelection,
} from "../types/composer";

interface ComposerState {
  projectName: string;
  language: Language;
  styling: Styling;
  // 라이브러리는 개별 boolean 상태 대신 Record로 관리하여 확장성을 높임
  selectedLibraries: Record<LibraryId, boolean>;

  // Actions
  setProjectName: (name: string) => void;
  setLanguage: (lang: Language) => void;
  setStyling: (styling: Styling) => void;
  toggleLibrary: (libId: LibraryId) => void;
  reset: () => void;

  // 엔진에 전달할 정제된 데이터를 반환하는 파생 상태 함수
  getSelection: () => ComposerSelection;
}

const initialState = {
  projectName: "my-react-app",
  language: "ts" as Language,
  styling: "css" as Styling,
  selectedLibraries: {
    vitest: false,
    zustand: false,
    lucide: false,
    prettier: false,
  },
};

export const useComposerStore = create<ComposerState>((set, get) => ({
  ...initialState,

  setProjectName: (projectName) => set({ projectName }),
  setLanguage: (language) => set({ language }),
  setStyling: (styling) => set({ styling }),

  toggleLibrary: (libId) =>
    set((state) => ({
      selectedLibraries: {
        ...state.selectedLibraries,
        [libId]: !state.selectedLibraries[libId],
      },
    })),

  reset: () => set(initialState),

  getSelection: () => {
    const state = get();
    // true로 체크된 라이브러리 키값만 모아서 배열로 변환
    const activeLibs = Object.entries(state.selectedLibraries)
      .filter((entry) => entry[1]) // entry[1]은 isSelected(boolean)를 의미함
      .map((entry) => entry[0] as LibraryId); // entry[0]은 key(string)를 의미함

    return {
      projectName: state.projectName.trim() || "my-react-app",
      language: state.language,
      styling: state.styling,
      selectedLibraries: activeLibs,
    };
  },
}));
