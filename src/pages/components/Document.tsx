import { Loader, MinusCircleIcon, PlusCircleIcon, Upload } from 'lucide-react'
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { useGetDocumentsQuery, useUploadDocumentMutation } from '../../services/documentApiSlice';
import { toast } from 'sonner';
import { useChatContext } from '../../context/chatContext';
import { useGetUserInfoQuery } from '../../services/userApiSlice';
import Retry from './Retry';
interface DocsInterface {
    name: string,
    _id: string,
    date?: string
}
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function DocumentSection() {

    const { data, refetch, isLoading: gettingDocuments, error: errorGettingDocs, isFetching: fetchingDocuments } = useGetDocumentsQuery()
    const { data: userData } = useGetUserInfoQuery()
    const [uploadedDocs, setUploadedDocs] = useState<DocsInterface[]>([])
    const [uploadingDocs, setUploadingDocs] = useState<File[] | null>(null)
    const docRef = useRef<HTMLInputElement | null>(null)
    const [uploadDocs] = useUploadDocumentMutation()
    const { currentUsingDocs, setCurrentUsingDocs, } = useChatContext()
    const [searchQuery, setSearchQuery] = useState<string>("")


    const uploadDocuments = async (files: FileList) => {
        try {
            if (!files)
                throw new Error("Please select valid files")
            for (let file of files) {
                if (file.size > MAX_FILE_SIZE)
                    throw new Error("Any file should not exceed 5mb size.")
            }
            const formData = new FormData()
            const fileList = Array.from(files);
            setUploadingDocs(fileList);

            fileList.forEach((file) => {
                formData.append("files", file);
            });

            const { success, message } = await uploadDocs({ formData }).unwrap();

            if (!success)
                throw new Error(message)
            setUploadingDocs(null)
        } catch (error: any) {
            toast.error(error?.message || error?.data?.message || "cant upload documents at the moment")
        }
        finally {
            setUploadingDocs(null)
        }

    }

    useEffect(() => {
        if (Array.isArray(data?.documents))
            setUploadedDocs(data?.documents)
        else
            setUploadedDocs([])
    }, [data])

    useEffect(() => {
        if (userData?.info)
            refetch()
    }, [userData])
    // UI FIXED VERSION

    return (
        <div className="w-full h-full flex flex-col gap-3 min-h-0">

            {/* Upload Button */}
            <button
                onClick={() => docRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-3 py-[8px] rounded-sm 
      bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium 
      transition-all shadow-sm hover:shadow-md"
            >
                <Upload size={18} />
                Upload Document
            </button>

            <input
                multiple
                className="hidden"
                type="file"
                accept="application/pdf"
                ref={docRef}
                onChange={(e) => {
                    const docFiles = e.target.files;
                    if (docFiles) uploadDocuments(docFiles);
                    e.target.value = "";
                }}
            />

            {/* Search */}
            {uploadedDocs?.length > 4 && (
                <input
                    className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background 
        focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search documents..."
                />
            )}

            {/* Content */}
            <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 pr-1">

                {/* loading */}
                {(gettingDocuments || fetchingDocuments) && (
                    <div className="flex justify-center py-4">
                        <Loader className="animate-spin text-orange-500" />
                    </div>
                )}

                {/* error */}
                {(errorGettingDocs && !gettingDocuments && !fetchingDocuments) && (
                    <Retry message="Failed to fetch documents" retry={refetch} />
                )}

                {/* uploading */}
                {uploadingDocs?.map((item, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/50"
                    >
                        <p className="text-sm truncate flex-1">{item.name}</p>
                        <Loader className="animate-spin text-orange-500" size={16} />
                    </div>
                ))}

                {/* docs list */}
                {!gettingDocuments &&
                    !errorGettingDocs &&
                    uploadedDocs
                        ?.filter((item) =>
                            item.name.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        ?.map((item) => (
                            <DocItem
                                key={item._id}
                                doc={item}
                                currentDocs={currentUsingDocs}
                                setCurrentDocs={setCurrentUsingDocs}
                            />
                        ))}
            </div>
        </div>
    )
}

export default DocumentSection


const DocItem = ({ doc, currentDocs, setCurrentDocs }: { doc: DocsInterface, currentDocs: string | undefined, setCurrentDocs: Dispatch<SetStateAction<string | undefined>> }) => {
    return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-xs 
  bg-background hover:bg-muted transition-all border border-transparent hover:border-border">

            <p className="text-sm truncate flex-1">
                {doc.name}
            </p>

            {currentDocs === doc._id ? (
                <MinusCircleIcon
                    className="cursor-pointer text-orange-500 hover:scale-110 transition-all"
                    size={18}
                    onClick={() => setCurrentDocs(undefined)}
                />
            ) : (
                <PlusCircleIcon
                    className="cursor-pointer text-muted-foreground hover:text-orange-500 hover:scale-110 transition-all"
                    size={18}
                    onClick={() =>
                        setCurrentDocs(doc._id)
                    }
                />
            )}
        </div>
    )
}