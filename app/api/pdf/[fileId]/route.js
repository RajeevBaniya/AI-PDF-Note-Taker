import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function GET(req, { params }) {
  try {
    // Get file record from database
    const fileRecord = await client.query(api.fileStorage.GetFileRecord, {
      fileId: params.fileId,
    });

    if (!fileRecord) {
      return new Response("PDF not found", { status: 404 });
    }

    // Fetch the actual PDF file
    const response = await fetch(fileRecord.fileUrl);
    
    if (!response.ok) {
      return new Response("Failed to fetch PDF", { status: response.status });
    }

    const pdfBlob = await response.blob();

    // Return the PDF with proper headers
    return new Response(pdfBlob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${fileRecord.fileName}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error fetching PDF:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
} 