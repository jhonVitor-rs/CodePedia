import type { Dispatch } from "react";
import type { CustomEditor } from "~/types/editor.server";
import { toggleCodeBlock, toggleFontStyleMark, isFontStyleActive } from "~/components/elements";

interface IKeyEvents {
  event: React.KeyboardEvent<HTMLDivElement>
  editor: CustomEditor
  activeButtons: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
  }
  setActiveButtons: Dispatch<React.SetStateAction<{
    bold: boolean;
    italic: boolean;
    underline: boolean;
  }>>
}

export function KeyEvents({event, editor, activeButtons, setActiveButtons}: IKeyEvents) {
  if(event.key === 'Tab'){
    event.preventDefault()
    const tabCharacter = '  '
    editor.insertText(tabCharacter)
  }

  if(!event.ctrlKey) return

  switch(event.key){
    case '`':
      event.preventDefault()
      toggleCodeBlock(editor)
      break;
    
    case 'b': {
      event.preventDefault()
      toggleFontStyleMark(editor, 'bold')
      setActiveButtons({...activeButtons, bold: isFontStyleActive(editor, 'bold')})
      break;
    }
    case 'i': {
      event.preventDefault()
      toggleFontStyleMark(editor, 'italic')
      setActiveButtons({...activeButtons, italic: isFontStyleActive(editor, 'italic')})
      break;
    }
    case 'u': {
      event.preventDefault()
      toggleFontStyleMark(editor, 'underline')
      setActiveButtons({...activeButtons, underline: isFontStyleActive(editor, 'underline')})
      break;
    }
  }
}