import type { Descendant } from "slate";
import type { Dispatch, SetStateAction} from "react";
import { useMemo, useState } from "react";
import { Editable, Slate } from "slate-react";
import { isFontStyleActive } from "./elements";
import { EditorButtons } from "./editorButtons";
import { KeyEvents } from "~/lib/keyEvents";
import { useAppContext } from "~/context/AppContext";
import { cn } from "~/lib/utils";

const initialState: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
]

interface EditorProps {
  className?: string;
  value: string
  onChange: Dispatch<SetStateAction<string>>
}

export function TextEditor({className, value, onChange}:EditorProps) {
  const {editor, renderElement, renderLeaf} = useAppContext()

  const [activeButtons, setActiveButtons] = useState({
    bold: isFontStyleActive(editor, 'bold'),
    italic: isFontStyleActive(editor, 'italic'),
    underline: isFontStyleActive(editor, 'underline')
  })

  const initialValue = useMemo(() => {
    try {
      return JSON.parse(value) as Descendant[] || initialState;
    } catch (error) {
      console.error("Error parsing slateValue:", error);
      return initialState;
    }
  }, [value])

  return(
    <Slate
      editor={editor}
      initialValue={initialValue}
      onChange={(value) => {
        const isAstChange = editor.operations.some(
          op => op.type !== 'set_selection'
        )
        if(isAstChange){
          const content = JSON.stringify(value)
          onChange(content)
        }
        // console.log(JSON.stringify(value))
      }}
    >
      <EditorButtons
        editor={editor}
        activeButtons={activeButtons}
        setActiveButtons={setActiveButtons}
      />
      <Editable
        className={cn("outline-none bg-white p-2 max-w-3xl w-full rounded-xl", className)}
        onKeyDown={(event) => {
          KeyEvents({
            editor,
            event,
            activeButtons,
            setActiveButtons
          })
        }}
        onSelect={() => {
          setActiveButtons({
            bold: isFontStyleActive(editor, 'bold'),
            italic: isFontStyleActive(editor, 'italic'),
            underline: isFontStyleActive(editor, 'underline')
          })
        }}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        spellCheck
      />
    </Slate>
  )
}
