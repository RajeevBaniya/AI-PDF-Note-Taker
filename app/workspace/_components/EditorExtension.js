import { chatSession } from '@/configs/AIModel'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import { useAction, useMutation } from 'convex/react'
import { Bold, Code, Heading1, Heading2, Heading3, Highlighter, Italic, List, ListOrdered, Sparkles, Strikethrough, Underline } from 'lucide-react'
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react'
import { useParams } from 'next/navigation'


import React from 'react'
import { toast } from 'sonner'

// console.log(List, ListOrdered);

function EditorExtension({editor}) {
    const {fileId}=useParams();
    const SearchAI=useAction(api.myAction.search)
    const saveNotes=useMutation(api.notes.AddNotes)
    const {user}=useUser();


    const onAiClick=async()=>{
        const selectedText=editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to,
            ' '
        );
        console.log("selectedText",selectedText);

        // Check if user has selected text
        if (!selectedText || selectedText.trim().length === 0) {
            toast("Please select some text to ask a question about the PDF content.");
            return;
        }

        toast("AI is getting your answer...")

        try {
            console.log("Searching for:", selectedText);
            console.log("FileId:", fileId);

            const result=await SearchAI({
                query:selectedText,
                fileId:fileId
            })

            console.log("Search result:", result);
            const UnformattedAns=JSON.parse(result);
            console.log("Parsed results:", UnformattedAns);
            let AllUnformattedAns='';

            // Check if we found any relevant content
            if (UnformattedAns && UnformattedAns.length > 0) {
                console.log("Found", UnformattedAns.length, "relevant chunks");
                UnformattedAns.forEach(item=>{
                    AllUnformattedAns=AllUnformattedAns+item.pageContent+' ';
                });
                console.log("Combined content length:", AllUnformattedAns.length);
            } else {
                console.log("No relevant content found");
            }

            let PROMPT;
            let FinalAns;

            if (AllUnformattedAns.trim().length > 0) {
                // We found relevant content, ask AI to answer based on it
                PROMPT="Answer this question directly and concisely: '"+selectedText+"' "+
                "Use only the following PDF content to answer. Keep the answer brief and to the point. "+
                "Do not repeat the question. Just provide the answer in plain text format. "+
                "PDF Content: "+AllUnformattedAns;

                console.log("Sending prompt to AI:", PROMPT.substring(0, 200) + "...");
                const AiModelResult=await chatSession.sendMessage(PROMPT);
                console.log("Raw AI response:", AiModelResult.response.text());

                // Clean up the AI response by removing markdown code blocks
                let rawResponse = AiModelResult.response.text();

                // Remove ```html and ``` markers
                rawResponse = rawResponse.replace(/```html\s*/gi, '');
                rawResponse = rawResponse.replace(/```\s*/g, '');

                // Remove any remaining ``` at the beginning or end
                rawResponse = rawResponse.replace(/^```/g, '').replace(/```$/g, '');

                console.log("Cleaned AI response:", rawResponse);
                FinalAns = rawResponse;
            } else {
                // No relevant content found in the PDF
                FinalAns="I couldn't find relevant information about '"+selectedText+"' in the uploaded PDF document. "+
                "Please make sure the PDF contains information related to your question, or try rephrasing your question.";
            }

            const AllText=editor.getHTML();
            editor.commands.setContent(AllText+'<p> <strong>Answer: </strong>'+FinalAns+' </p> ');

            saveNotes({
                notes:editor.getHTML(),
                fileId:fileId,
                createdBy:user?.primaryEmailAddress?.emailAddress
            })

        } catch (error) {
            console.error("Error during AI search:", error);
            toast("There was an error processing your request. Please try again.");
        }
    }


  return editor && (
    <div className='p-5'>
        <div className="control-group">
            <div className="button-group flex gap-3">
                <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor.isActive('heading', { level: 1 }) ? 'text-blue-500' : ''}
                >
                    <Heading1 />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'text-blue-500' : ''}
                >
                    <Heading2 />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive('heading', { level: 3 }) ? 'text-blue-500' : ''}
                >
                    <Heading3 />
                </button>
                <button
                    onClick={() => editor && editor.chain().focus().toggleBold().run()}
                    className={editor && editor.isActive('bold') ? 'text-blue-500' : ''}
                    // disabled={!editor}
                >
                    <Bold />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'text-blue-500' : ''}
                >
                    <Italic />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={editor.isActive('underline') ? 'text-blue-500' : ''}
                >
                    <Underline />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    className={editor.isActive('highlight') ? 'text-blue-500' : ''}
                >
                    <Highlighter />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={editor.isActive('codeBlock') ? 'text-blue-500' : ''}
                >
                    <Code />
                </button>
                <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'text-blue-500' : ''}
            >
                <List />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'text-blue-500' : ''}
            >
                <ListOrdered />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive('strike') ? 'text-blue-500' : ''}
            >
                <Strikethrough />
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={editor.isActive({ textAlign: 'left' }) ? 'text-blue-500' : ''}
            >
                <AlignLeft />
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={editor.isActive({ textAlign: 'center' }) ? 'text-blue-500' : ''}
            >
                <AlignCenter />
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={editor.isActive({ textAlign: 'right' }) ? 'text-blue-500' : ''}
            >
                <AlignRight />
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                className={editor.isActive({ textAlign: 'justify' }) ? 'text-blue-500' : ''}
            >
                <AlignJustify />
            </button>

            <button
                onClick={() => onAiClick()}
                className={'hover:text-blue-500'}
            >
                <Sparkles />
            </button>
            </div>
        </div>
    </div>
  )
}

export default EditorExtension