'use client';

import React, { useState } from 'react';
import Button from './ui/Button';

interface FileUploaderProps {
    onUpload: (file: File) => void;
    accept?: string;
    label?: string;
}

export default function FileUploader({ onUpload, accept = '.pdf,.doc,.docx,.jpg,.png', label = 'Adicionar Documento' }: FileUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            // Simulate upload delay
            setTimeout(() => {
                onUpload(file);
                setIsUploading(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }, 1000);
        }
    };

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept={accept}
                onChange={handleFileChange}
            />
            <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full"
            >
                {isUploading ? 'Enviando...' : `📎 ${label}`}
            </Button>
        </div>
    );
}
