import React from "react"
import EditorJS, { OutputData } from "@editorjs/editorjs"
import DragAndDrop from "editorjs-drag-drop"
import Undo from "editorjs-undo"
import Header from "@editorjs/header"
import List from "@editorjs/list"
import Delimiter from "@editorjs/delimiter"
import Alignment from "editorjs-paragraph-with-alignment"

interface EditorProps {
    placeholder?: string | "Начните писать"
    readOnly?: boolean

    header?: boolean
    list?: boolean
    delimiter?: boolean
    alignment?: boolean

    onChange: (blocks: OutputData["blocks"]) => void
    initialBlocks?: OutputData["blocks"]
}

const Editor: React.FC<EditorProps> = (props) => {
    const { placeholder, header, list, delimiter, alignment, onChange, initialBlocks, readOnly } = props

    const tools: any = {}
    if (header) tools.header = Header
    if (list) tools.list = List
    if (delimiter) tools.delimiter = Delimiter
    // tools.alignment = Alignment
    tools.paragraph = {
        class: Alignment,
        inlineToolbar: true,
        config: {
            default: "justify",
        },
    }

    React.useEffect(() => {
        const editor = new EditorJS({
            onReady: () => {
                new Undo({ editor }), new DragAndDrop(editor)
            },
            holder: "editor",
            placeholder,
            readOnly,
            tools,
            data: {
                blocks: initialBlocks,
            },
            async onChange() {
                const { blocks } = await editor.save()
                onChange(blocks)
            },
        })

        return () => {
            editor.isReady
                .then(() => {
                    editor.destroy()
                })
                .catch((e) => console.error("ERROR editor cleanup", e))
        }
    }, [])

    return <div id="editor" />
}

export default Editor
