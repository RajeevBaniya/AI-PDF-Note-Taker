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
            let pageReferences = new Set();

            // Check if we found any relevant content
            if (UnformattedAns && UnformattedAns.length > 0) {
                console.log("Found", UnformattedAns.length, "relevant chunks");
                UnformattedAns.forEach(item=>{
                    AllUnformattedAns=AllUnformattedAns+item.pageContent+' ';
                    if (item.metadata.pageNumber) {
                        pageReferences.add(item.metadata.pageNumber);
                    }
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
                
                // Don't add page references to the answer
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
    <div className='p-3 border-b overflow-x-auto'>
      <div className="flex flex-wrap gap-1 sm:gap-2 min-w-max">
        <div className="flex flex-wrap gap-1 sm:gap-2 items-center">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-1.5 sm:p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'text-blue-500 bg-blue-50' : ''}`}
          >
            <Heading1 className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1.5 sm:p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'text-blue-500 bg-blue-50' : ''}`}
          >
            <Heading2 className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-1.5 sm:p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'text-blue-500 bg-blue-50' : ''}`}
          >
            <Heading3 className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </button>
          <div className="w-px h-6 bg-gray-200 mx-1"></div>
          <button
            onClick={() => editor && editor.chain().focus().toggleBold().run()}
            className={`p-1.5 sm:p-2 rounded hover:bg-gray-100 transition-colors ${editor && editor.isActive('bold') ? 'text-blue-500 bg-blue-50' : ''}`}
          >
            <Bold className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 sm:p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive('italic') ? 'text-blue-500 bg-blue-50' : ''}`}
          >
            <Italic className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 sm:p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive('underline') ? 'text-blue-500 bg-blue-50' : ''}`}
          >
            <Underline className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`p-1.5 sm:p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive('highlight') ? 'text-blue-500 bg-blue-50' : ''}`}
          >
            <Highlighter className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1.5 sm:p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive('strike') ? 'text-blue-500 bg-blue-50' : ''}`}
          >
            <Strikethrough className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </button>
          <div className="w-px h-6 bg-gray-200 mx-1"></div>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-1.5 sm:p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive('codeBlock') ? 'text-blue-500 bg-blue-50' : ''}`}
          >
            <Code className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 sm:p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive('bulletList') ? 'text-blue-500 bg-blue-50' : ''}`}
          >
            <List className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 sm:p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive('orderedList') ? 'text-blue-500 bg-blue-50' : ''}`}
          >
            <ListOrdered className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </button>
          <div className="w-px h-6 bg-gray-200 mx-1"></div>
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-1.5 sm:p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'text-blue-500 bg-blue-50' : ''}`}
          >
            <AlignLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-1.5 sm:p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'text-blue-500 bg-blue-50' : ''}`}
          >
            <AlignCenter className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-1.5 sm:p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'text-blue-500 bg-blue-50' : ''}`}
          >
            <AlignRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`p-1.5 sm:p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive({ textAlign: 'justify' }) ? 'text-blue-500 bg-blue-50' : ''}`}
          >
            <AlignJustify className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </button>
          <div className="w-px h-6 bg-gray-200 mx-1"></div>
          <button
            onClick={() => onAiClick()}
            className="p-1.5 sm:p-2 rounded hover:bg-gray-100 transition-colors text-blue-500"
            title="AI Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditorExtension