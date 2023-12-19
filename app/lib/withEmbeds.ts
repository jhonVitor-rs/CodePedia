import type { CustomEditor } from "~/types/editor.server"

export const withEmbeds = (editor: CustomEditor) => {
  const { insertData, isInline, isVoid } = editor

  editor.insertData = (data) => {
    console.log('Data', data.getData('text/plain'))

    return insertData(data)
  }
  return editor
}