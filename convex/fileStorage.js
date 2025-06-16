import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const AddFileEntryToDb=mutation({
    args:{
        fileId:v.string(),
        storageId:v.string(),
        fileName:v.string(),
        createdBy:v.string(),
        fileUrl:v.string()
    },
    handler:async(ctx,args)=>{
        const result=await ctx.db.insert('pdfFiles',{
            fileId:args.fileId,
            fileName:args.fileName,
            storageId:args.storageId,
            fileUrl:args.fileUrl,
            createdBy:args.createdBy
        })
        return 'Inserted'
    }
})

export const getFileUrl = mutation({
    args: {
        storageId: v.string()
    },
    handler: async(ctx, args) => {
        const url = await ctx.storage.getUrl(args.storageId);
        return url;
    }
})

export const GetFileRecord=query({
    args:{
        fileId:v.string()
    },
    handler:async(ctx,args)=>{
        const result=await ctx.db.query('pdfFiles').filter((q)=>q.eq(q.field('fileId'),args.fileId))
        .collect();
        console.log(result);
        return result[0];
    }
})

export const GetUserFiles=query({
    args:{
        userEmail:v.optional(v.string())
    },
    handler:async(ctx,args)=>{
        if(!args?.userEmail){
            return;
        }

        const result=await ctx.db.query('pdfFiles')
        .filter((q)=>q.eq(q.field('createdBy'),args?.userEmail)).collect();

        return (result);
    }
})

export const DeleteFile = mutation({
    args: {
        fileId: v.string(),
        storageId: v.string()
    },
    handler: async (ctx, args) => {
        // Delete the file from storage
        await ctx.storage.delete(args.storageId);
        
        // Delete the file entry from the database
        const existingFile = await ctx.db
            .query('pdfFiles')
            .filter((q) => q.eq(q.field('fileId'), args.fileId))
            .collect();

        if (existingFile.length > 0) {
            await ctx.db.delete(existingFile[0]._id);
        }

        // Delete associated notes
        const existingNotes = await ctx.db
            .query('notes')
            .filter((q) => q.eq(q.field('fileId'), args.fileId))
            .collect();

        if (existingNotes.length > 0) {
            await ctx.db.delete(existingNotes[0]._id);
        }

        // Delete associated document embeddings
        const existingDocs = await ctx.db
            .query('documents')
            .filter((q) => q.eq(q.field('metadata'), { fileId: args.fileId }))
            .collect();

        for (const doc of existingDocs) {
            await ctx.db.delete(doc._id);
        }

        return 'Deleted';
    }
});