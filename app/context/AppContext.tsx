import { useMemo, type ReactNode, useCallback, createContext, useContext } from "react";
import { withReact, type RenderElementProps, type RenderLeafProps } from "slate-react";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import { withEmbeds } from "~/lib/withEmbeds";
import { Element, Leaf} from '~/components/elements'
import type { CustomEditor } from "~/types/editor.server";

type AppContextType = {
  editor: CustomEditor;
  renderElement: (props: RenderElementProps) => JSX.Element;
  renderLeaf: (props: RenderLeafProps) => JSX.Element;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export default function AppProvider({children}: {children: ReactNode}) {
  const editor = useMemo(() => withEmbeds(withHistory(withReact(createEditor()))), [])

  const renderElement = useCallback((props: RenderElementProps) => <Element {...props}/>, [])
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props}/>, [])

  const contextValue: AppContextType = {
    editor,
    renderElement,
    renderLeaf
  }

  return(
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
}