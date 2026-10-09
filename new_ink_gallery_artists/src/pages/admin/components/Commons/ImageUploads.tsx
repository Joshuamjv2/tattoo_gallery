import React, { useState, useCallback } from 'react';
import { BiX } from 'react-icons/bi';

interface MultiImageUploadProps {
  onImagesSelected: (files: File[]) => void;
  onOldImageRemoved?: (file: string) => void;
  maxFiles?: number;
  accept?: string;
  initial_images?: string[]
}

export default function MultiImageUpload({
  initial_images,
  onImagesSelected,
  onOldImageRemoved,
  maxFiles = 10,
  accept = "image/*"
}: MultiImageUploadProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>(initial_images ? initial_images: []);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isInitialImage = (url: string) => initial_images?.includes(url);

  const handleFileChange = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => file.type.startsWith('image/'));

    if (validFiles.length === 0) {
      setError('Please select valid image files');
      return;
    }

    if (validFiles.length + previewUrls.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} images`);
      return;
    }

    setError(null);

    // Create preview URLs
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);

    // Call parent component with all selected files
    onImagesSelected(validFiles);
  }, [onImagesSelected, previewUrls.length, maxFiles]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files);
      e.target.value = ''; // Reset input to allow selecting same files again
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const removeImage = (index: number) => {
    const newPreviewUrls = [...previewUrls];
    // call function here if removed image is in initial urls. The idea is to have an array of removed old images and this will be called in the parent using onOldImage removed
    const urlToRemove = previewUrls[index];
    const isInitial = isInitialImage(urlToRemove);
    if (isInitial && onOldImageRemoved) {
      onOldImageRemoved(urlToRemove);
    }
    URL.revokeObjectURL(newPreviewUrls[index]); // Free memory
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
  };

  // Check if we've reached the maximum number of files
  const maxFilesReached = previewUrls.length >= maxFiles;

  return (
    <div className="space-y-4 sm:mt-4">
      {!maxFilesReached && (
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="image-upload"
            multiple
            accept={accept}
            onChange={handleInputChange}
            className="hidden"
            disabled={maxFilesReached}
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <div className="space-y-2">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-blue-600 hover:text-blue-500">
                  Click to upload
                </span>{' '}
                or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                {accept} up to {maxFiles} images
              </p>
            </div>
          </label>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {previewUrls.length > 0 && (
        <div className='flex flex-col justify-center items-center w-full gap-2'>
          <p className="text-sm text-gray-500">
            {previewUrls.length}/{maxFiles} images added
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {previewUrls.map((url, index) => (
              <div key={url} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index}`} 
                  className="w-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 bg-black"
                  onClick={() => removeImage(index)}
                  aria-label="Remove image"
                >
                  <BiX />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}