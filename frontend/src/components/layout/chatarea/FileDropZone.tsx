import { Toaster } from 'sonner';
import { useCustomTheme } from '@/hooks/useCustomTheme';
import LoadingSpinner from '../../ui/Spinner/LoadingSpinner';
import DropButton from './DropButton';

interface FileDropzoneProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const FileDropzone = ({ isLoading, setIsLoading }: FileDropzoneProps) => {
  const customTheme = useCustomTheme();
  
  return (
    <>
      <div className={`w-full h-full flex justify-center items-center`}>
        { isLoading ? <LoadingSpinner/> : <DropButton setIsLoading={setIsLoading}/> }
      </div>
      <Toaster theme={customTheme.toaster === "light" ? "light" : "dark"}/>
    </>
  );
};

export default FileDropzone;