import type { CustomEditor } from "~/types/editor.server";
import type { Dispatch} from "react";
import React from "react";
import { isFontStyleActive, toggleCodeBlock, toggleFontStyleMark, toggleListType, toggleTitleType } from "./elements";
import { MdFormatBold, MdFormatItalic, MdFormatUnderlined, MdCode, MdFormatListBulleted, MdFormatListNumbered } from "react-icons/md/index.js";
import { Button } from "./ui/button";

interface IEditorButtons {
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

export function EditorButtons({editor, activeButtons, setActiveButtons}: IEditorButtons) {

  return (
    <div className="flex flex-row flex-wrap gap-2 p-2 items-center">
      <Button 
        className="flex justify-center text-2xl p-2"
        onMouseDown={() => {
          toggleFontStyleMark(editor, 'bold')
          setActiveButtons({...activeButtons, bold: isFontStyleActive(editor, 'bold')})
        }}
        variant={ !activeButtons.bold ? 'default' : "secondary"}
      >
        <MdFormatBold/>
      </Button>

      <Button 
        className="flex justify-center text-2xl p-2"
        onMouseDown={() => {
          toggleFontStyleMark(editor, 'italic')
          setActiveButtons({...activeButtons, italic: isFontStyleActive(editor, 'italic')})
        }}
        variant={ !activeButtons.italic ? 'default' : "secondary"}
      >
        <MdFormatItalic/>
      </Button>

      <Button 
        className="flex justify-center text-2xl p-2"
        onMouseDown={() => {
          toggleFontStyleMark(editor, 'underline')
          setActiveButtons({...activeButtons, underline: isFontStyleActive(editor, 'underline')})
        }}
        variant={ !activeButtons.underline ? 'default' : "secondary"}
      >
        <MdFormatUnderlined/>
      </Button>
      |
      <Button 
        className="flex justify-center text-2xl p-3"
        onMouseDown={() => {
          toggleTitleType(editor, 'title')
        }}
      >
        <strong className="text-sm">H1</strong>
      </Button>

      <Button 
        className="flex justify-center text-2xl p-3"
        onMouseDown={() => {
          toggleTitleType(editor, 'subtitle')
        }}
      >
        <strong className="text-sm">h2</strong>
      </Button>

      <Button 
        className="flex justify-center text-2xl p-2"
        onMouseDown={() => {
          toggleCodeBlock(editor)
        }}
      >
        <MdCode/>
      </Button>

      <Button 
        className="flex justify-center text-2xl p-2"
        onMouseDown={() => {
          toggleListType(editor, 'ul_list')
        }}
      >
        <MdFormatListBulleted/>
      </Button>
      <Button 
        className="flex justify-center text-2xl p-2"
        onMouseDown={() => {
          toggleListType(editor, 'ol_list')
        }}
      >
        <MdFormatListNumbered/>
      </Button>
    </div>
  )
}