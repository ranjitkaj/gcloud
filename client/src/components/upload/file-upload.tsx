import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  X, 
  ImageIcon, 
  FileVideo, 
  AlertCircle, 
  CheckCircle2, 
  Loader2 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface FileWithPreview extends File {
  preview?: string;
  id: string;
  uploadProgress?: number;
  status: 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

interface FileUploadProps {
  onFilesSelected: (files: FileWithPreview[]) => void;
  onFileRemoved?: (fileId: string) => void;
  initialFiles?: FileWithPreview[];
  maxFiles?: number;
  allowMultiple?: boolean;
  className?: string;
}

export default function FileUpload({
  onFilesSelected,
  onFileRemoved,
  initialFiles = [],
  maxFiles = 10,
  allowMultiple = true,
  className = "",
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>(initialFiles);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Generate unique ID for a file
  const generateFileId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  // Handle file selection
  const handleFileSelection = (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    // Check if we're exceeding the maximum file limit
    if (files.length + selectedFiles.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `You can only upload a maximum of ${maxFiles} files.`,
        variant: "destructive",
      });
      return;
    }

    const newFiles: FileWithPreview[] = [];
    const invalidFiles: string[] = [];

    Array.from(selectedFiles).forEach((file) => {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        invalidFiles.push(`${file.name} (unsupported file type)`);
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push(`${file.name} (exceeds 20MB limit)`);
        return;
      }

      // Create file preview URL
      const fileWithPreview = file as FileWithPreview;
      fileWithPreview.id = generateFileId();
      fileWithPreview.preview = URL.createObjectURL(file);
      fileWithPreview.uploadProgress = 0;
      fileWithPreview.status = 'uploading';

      // Simulate upload progress
      simulateUploadProgress(fileWithPreview);

      newFiles.push(fileWithPreview);
    });

    // Show error for invalid files
    if (invalidFiles.length > 0) {
      toast({
        title: "Some files couldn't be added",
        description: (
          <ul className="list-disc pl-5 mt-2 text-sm">
            {invalidFiles.map((file, index) => (
              <li key={index}>{file}</li>
            ))}
          </ul>
        ),
        variant: "destructive",
      });
    }

    // Update state and call callback
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onFilesSelected(updatedFiles);
  };

  // Simulate file upload progress
  const simulateUploadProgress = (file: FileWithPreview) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      
      if (progress >= 100) {
        clearInterval(interval);
        progress = 100;
        
        setFiles(prevFiles => 
          prevFiles.map(f => 
            f.id === file.id 
              ? { ...f, uploadProgress: 100, status: 'success' } 
              : f
          )
        );
      } else {
        setFiles(prevFiles => 
          prevFiles.map(f => 
            f.id === file.id 
              ? { ...f, uploadProgress: progress } 
              : f
          )
        );
      }
    }, 300);
  };

  // Handle file input change
  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileSelection(e.target.files);
    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle remove file
  const handleRemoveFile = (fileId: string) => {
    const fileToRemove = files.find(f => f.id === fileId);
    
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    
    setFiles(files.filter(f => f.id !== fileId));
    
    if (onFileRemoved) {
      onFileRemoved(fileId);
    }
  };

  // Handle drag events
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelection(e.dataTransfer.files);
  };

  // Get file type icon
  const getFileTypeIcon = (file: FileWithPreview) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return <ImageIcon className="h-6 w-6 text-gray-400" />;
    } else if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return <FileVideo className="h-6 w-6 text-gray-400" />;
    }
    return null;
  };

  // Get status icon
  const getStatusIcon = (file: FileWithPreview) => {
    switch (file.status) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={className}>
      {/* Drag and drop area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 transition-colors duration-150 ease-in-out
          flex flex-col items-center justify-center cursor-pointer
          ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={allowMultiple}
          onChange={handleFileInputChange}
          accept={ALLOWED_TYPES.join(',')}
          className="hidden"
        />
        <Upload className="h-10 w-10 text-gray-400 mb-2" />
        <h3 className="text-lg font-medium mb-1">
          Drag & Drop or Click to Upload
        </h3>
        <p className="text-sm text-gray-500 mb-2 text-center">
          Upload property images or videos (up to 20MB each)
        </p>
        <p className="text-xs text-gray-400 text-center">
          Supported formats: JPEG, PNG, WebP, MP4, MPEG, QuickTime, WebM
        </p>
        {files.length > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            {files.length} of {maxFiles} files uploaded
          </div>
        )}
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          className="mt-4"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          Select Files
        </Button>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium">Uploaded Files</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.map((file) => (
              <Card key={file.id} className="overflow-hidden">
                <CardContent className="p-3">
                  <div className="flex items-start space-x-3">
                    {/* Preview or icon */}
                    {file.preview && ALLOWED_IMAGE_TYPES.includes(file.type) ? (
                      <div className="h-14 w-14 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-14 w-14 flex-shrink-0 rounded-md bg-gray-100 flex items-center justify-center">
                        {getFileTypeIcon(file)}
                      </div>
                    )}

                    {/* File details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(file.id);
                          }}
                          className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      
                      {/* Progress bar */}
                      <div className="mt-2 flex items-center space-x-2">
                        <Progress value={file.uploadProgress} className="h-1.5 flex-1" />
                        <span className="text-xs text-gray-500 flex items-center space-x-1">
                          {getStatusIcon(file)}
                          <span>{file.uploadProgress}%</span>
                        </span>
                      </div>
                      
                      {/* Error message if any */}
                      {file.status === 'error' && file.errorMessage && (
                        <p className="text-xs text-red-500 mt-1">{file.errorMessage}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}