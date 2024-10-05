"use client";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import toast from "react-hot-toast";
import { error, log } from "console";    
import { UploadDropzone } from "@/lib/uploadthing";
import { useState } from "react";

interface FileloadProps {
    onChange: (url?: string) => void;
    endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = (
    { onChange, endpoint} : FileloadProps) => 
{   
    
    return (
        <UploadDropzone 
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                // console.log("is done");
                onChange(res?.[0].url);
            }}
            onUploadError={(error: Error) => {
                toast.error(`${error?.message}`);
            }}
        />
    )
}