import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";


// const pdfUrl='https://moonlit-impala-398.convex.cloud/api/storage/a6911555-1f78-40b4-ae7f-01a14aace02a'
export async function GET(req){

    const reqUrl=req.url;
    const {searchParams}=new URL(reqUrl);
    const pdfUrl=searchParams.get('pdfUrl');
    console.log(pdfUrl);

    //1. Load the PDF from the database
    const response=await fetch(pdfUrl);
    const data=await response.blob();
    const loader=new WebPDFLoader(data);
    const docs=await loader.load();

    // Modified to include page numbers
    let pdfTextContent = [];
    docs.forEach((doc, index) => {
        pdfTextContent.push({
            content: doc.pageContent,
            pageNumber: index + 1,
            metadata: doc.metadata
        });
    });

    //2. Split the text into Small chunks
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 20,
    });

    // Modified to preserve page numbers
    const output = await splitter.createDocuments(
        pdfTextContent.map(doc => doc.content),
        pdfTextContent.map(doc => ({
            pageNumber: doc.pageNumber,
            metadata: doc.metadata
        }))
    );

    let splitterList = [];
    output.forEach(doc => {
        splitterList.push({
            content: doc.pageContent,
            pageNumber: doc.metadata.pageNumber
        });
    });

    return NextResponse.json({result: splitterList})
}
