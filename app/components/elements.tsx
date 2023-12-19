import { Editor as SlateEditor, Transforms, Element as SlateElement } from "slate"
import type { RenderElementProps, RenderLeafProps } from "slate-react"
import type { CustomEditor } from "~/types/editor.server"

type ValidMark = "bold" | "italic" | "underline";
type EditorStyle = 'code' | 'pre' | 'ul_list' | 'ol_list' | 'title' | 'subtitle';

//Elements
export const Element = (props: RenderElementProps) => {
  switch (props.element.type) {
      case 'pre':
        return (
          <pre {...props.attributes} className="bg-slate-800 p-2 rounded-md flex flex-col w-full overflow-auto">
            {props.children}
          </pre>
        )
      case 'code':
        return (
          <code {...props.attributes} className="text-yellow-500 flex w-full">
            {props.children}
          </code>
        )
      case 'ul_list':
        return(
          <ul {...props.attributes} className="leading-none list-disc flex flex-col gap-2 p-2 ml-4">
            {props.children}
          </ul>
        )
      case 'ol_list':
        return(
          <ol {...props.attributes} className="leading-none list-decimal flex flex-col gap-2 p-2 ml-4">
            {props.children}
          </ol>
        )
      case 'list_item':
        return (
          <li className="marker:text-slate-900 text-slate-900" {...props.attributes}>
            {props.children}
          </li>
        )
      case 'title':
        return (
          <h1 {...props.attributes} className="font-bold text-3xl">
            {...props.children}
          </h1>
        )
      case 'subtitle':
        return (
          <h2 {...props.attributes} className="font-semibold text-2xl">
            {...props.children}
          </h2>
        )
      default:
        return (
          <p {...props.attributes} className="text-slate-900">
            {props.children}
          </p>
        )
      }
}

//Leaf =====================================================================================
export const Leaf = (props: RenderLeafProps) => {
  return(
    <span
      {...props.attributes}
      style={{
        fontWeight: props.leaf.bold ? 'bold' : 'normal',
        fontStyle: props.leaf.italic ? 'italic' : 'normal',
        textDecoration: props.leaf.underline ? 'underline' : 'normal',
      }}
    >
      {props.children}
    </span>
  )
}

//Customized Elements=======================================================================
export function isFontStyleActive(editor: CustomEditor, mark: ValidMark) {
  const marks = SlateEditor.marks(editor);
  return marks ? marks[mark] === true : false;
}

export function isEditorTypeActive(editor: CustomEditor, property: EditorStyle) {
  const [match] = SlateEditor.nodes(editor, {
    match: n => n.type === property
  })

  return !!match
}

export function toggleFontStyleMark(editor: CustomEditor, mark: ValidMark) {
  const isActive = isFontStyleActive(editor, mark)
  if (isActive) {
    SlateEditor.removeMark(editor, mark)
  } else {
    SlateEditor.addMark(editor, mark, true)
  }
}

export function toggleTitleType(editor: CustomEditor, title: EditorStyle) {
  const isActive = isEditorTypeActive(editor, title)

  Transforms.setNodes(
    editor,
    {type: isActive ? 'paragraph' : title},
    {match: n => SlateElement.isElement(n) && SlateEditor.isBlock(editor, n)}
  )
}

export function toggleCodeBlock(editor: CustomEditor) {
  const isActive = isEditorTypeActive(editor, 'code')
  
  Transforms.unwrapNodes(editor, {
    match: n => !SlateEditor.isEditor(n) && SlateElement.isElement(n)
      && n.type === 'pre', split: true
  })

  Transforms.setNodes(
    editor,
    {type: isActive ? 'paragraph' : 'code'},
  )

  if(!isActive){
    const preStyle = {type: 'pre', children: []}
    Transforms.wrapNodes(editor, preStyle)
  }
}

export function toggleListType(editor: CustomEditor, listType: EditorStyle) {
  const isActive = isEditorTypeActive(editor, listType)
  
  Transforms.unwrapNodes(editor, {
    match: n => !SlateEditor.isEditor(n) && SlateElement.isElement(n)
      && (n.type === 'ol_list' || n.type === 'ul_list'), split: true
  })

  let newProperties: Partial<SlateElement> = {
    type: isActive ? 'paragraph' : 'list_item'
  }
  Transforms.setNodes<SlateElement>(
    editor,
    newProperties
  )

  if(!isActive) {
    const list = { type: listType, children: [] };
    Transforms.wrapNodes(editor, list);
  }
}