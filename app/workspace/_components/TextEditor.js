import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect } from 'react'
import EditorExtension from './EditorExtension'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useSave } from './SaveContext'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'

function TextEditor({fileId}) {
    const { registerSaveFunction } = useSave()
    const { user } = useUser()
    const saveNotes = useMutation(api.notes.AddNotes)

    const notes=useQuery(api.notes.GetNotes,{
        fileId:fileId
    })

    console.log(notes);
    const editor = useEditor({
        extensions: [StarterKit,
            Placeholder.configure({
                placeholder:'Start Taking your notes with NoteAI...'
            }),
            Underline,
            Highlight,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content: notes || '',
        editorProps:{
            attributes:{
                class:'focus:outline-none h-screen p-5'
            }
        }
    })

    useEffect(()=>{
        editor&&editor.commands.setContent(notes)
    },[notes&&editor])

    // Register save function with context
    useEffect(() => {
        if (editor && user) {
            const handleSave = async () => {
                try {
                    const currentContent = editor.getHTML()
                    await saveNotes({
                        notes: currentContent,
                        fileId: fileId,
                        createdBy: user?.primaryEmailAddress?.emailAddress
                    })
                    toast.success("Notes saved successfully!")
                } catch (error) {
                    console.error("Save failed:", error)
                    toast.error("Failed to save notes. Please try again.")
                    throw error
                }
            }

            registerSaveFunction(handleSave)
        }
    }, [editor, user, fileId, registerSaveFunction])


  return (
    <div>
       <EditorExtension editor={editor} />
        <div className='overflow-scroll h-[88vh]'>
            <EditorContent editor={editor} />
        </div>
    </div>
  )
}

export default TextEditor