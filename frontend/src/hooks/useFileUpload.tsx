import { useDropzone } from 'react-dropzone';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';
import { useThreadStore } from '@/store/dataStore';

interface UseFileUploadOptions {
  onFileProcess: (file: File) => Promise<void>;
}

interface UseFileUploadReturn {
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
  isDragActive: boolean;
}

export const useFileUpload = ({
  onFileProcess
}: UseFileUploadOptions): UseFileUploadReturn => {
  const locale = useTranslations('ChatAreaDropButton');
  const { addThread, getActiveThread, addChatMessage } = useThreadStore();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/octet-stream': ['.hwp', '.hwpx']
    },
    onDropAccepted: (acceptedFiles) => {
        acceptedFiles.forEach(async file => {
            try{
                await onFileProcess(file);
            } catch (e) {
                toast.error(locale('unknownServerException'))
            }
        })
    },
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach(file => {
        if (file.errors[0] && file.errors[0].code === "file-invalid-type") {
          toast.error(locale("invalidFileFormatException"));
        }
      });
    },
  });

  return {
    getRootProps,
    getInputProps,
    isDragActive
  };
};