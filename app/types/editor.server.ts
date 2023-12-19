import type { BaseEditor } from "slate";
import type { HistoryEditor } from "slate-history";
import type { ReactEditor } from "slate-react";

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;
export type CustomElement = ParagraphElement | HeadingElement | ListElement;
export type FormattedText = { text: string; bold?: true, italic?: true, underline?: true }
export type CustomText = FormattedText;

type ParagraphElement = {
  type: 'paragraph' | 'code' | 'pre' | 'title' | 'subtitle' | 'list_item'
  children: CustomText[]
}

type HeadingElement = {
  type: 'heading'
  level: number
  children: CustomText[]
}

type ListElement = {
  type: 'ul_list' | 'ol_list'
  children: ParagraphElement[]
}

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
  }
}
