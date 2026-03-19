import { Loader, MinusCircleIcon, PlusCircleIcon, Upload } from 'lucide-react'
import React, { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { useGetDocumentsQuery, useUploadDocumentMutation } from '../../services/documentApiSlice';
import { toast } from 'sonner';
import { useChatContext } from '../../context/chatContext';
import { useGetUserInfoQuery } from '../../services/userApiSlice';
import { useLazyNewChatQuery } from '../../services/chatApiSlice';
interface DocsInterface {
    name: string,
    _id: string,
    date?: string
}

function DocumentSection() {

    const { data, refetch } = useGetDocumentsQuery()
    const { data: userData, isLoading: userLoading } = useGetUserInfoQuery()
    const [uploadedDocs, setUploadedDocs] = useState<DocsInterface[]>([])
    const [uploadingDocs, setUploadingDocs] = useState<File[] | null>(null)
    const docRef = useRef<HTMLInputElement | null>(null)
    const [uploadDocs, { isLoading }] = useUploadDocumentMutation()
    const { currentUsingDocs, setCurrentUsingDocs, } = useChatContext()


    const uploadDocuments = async (files: FileList) => {
        try {
            if (!files)
                throw new Error("Please select valid files")
            // console.log(files)
            const formData = new FormData()
            const fileList = Array.from(files);
            setUploadingDocs(fileList);

            fileList.forEach((file) => {
                formData.append("files", file);
            });

            const { documents, success, message } = await uploadDocs({ formData }).unwrap();

            if (!success)
                throw new Error(message)
            console.log(documents)
            let ids = Array.from(documents).map((item) => item.id)
            console.log(ids)
            setCurrentUsingDocs((prev) => {
                const newSet = new Set(prev)
                ids.forEach((item) => newSet.add(item))
                return newSet
            })
        } catch (error: any) {
            toast.error(error?.message || error?.data?.message || "cant upload documents at the moment")
        }
        finally {
            setUploadingDocs(null)
        }

    }

    useEffect(() => {
        // console.log(data)
        console.log(data)
        if (Array.isArray(data?.documents))
            setUploadedDocs(data?.documents)
        else
            setUploadedDocs([])
    }, [data])

    useEffect(() => {
        if (userData?.info)
            refetch()
    }, [userData])
    return (
        <div className="docs w-full  flex flex-col place-content-start gap-2 place-items-center h-1/2 px-0 py-1  overflow-y-scroll" style={{ scrollbarWidth: "none" }}>

            <h3 className='bg-white/80 rounded-sm  w-full text-center text-(--text) flex flex-row place-content-center place-items-center gap-4 group cursor-pointer' onClick={() => docRef.current?.click()}>
                <span>Upload Document</span>
                <span className='w-fit float-right '><Upload size={20} className='w-fit ' /></span>
            </h3>
            <input
                multiple
                className="hidden"
                type="file"
                accept="application/pdf"
                ref={docRef}
                onChange={(e) => {
                    const docFiles = e.target.files;
                    if (docFiles) uploadDocuments(docFiles);
                }}
            />
            <div className="docs w-full flex flex-col-reverse place-content-start place-items-center gap-1 h-full overflow-y-scroll" style={{ scrollbarWidth: "none" }}>
                {uploadingDocs?.map((item) => {
                    return <div className="document flex  gap-1 place-content-start place-items-center w-full border border-slate-200 px-2 py-0.5  " >
                        <h3 className='text-sm text-start w-full line-clamp-1'>{item.name}</h3>
                        <Loader
                            className="animate-spin"
                            size={20}
                        />
                    </div>
                })}
                {uploadedDocs?.map((item) => {
                    return <DocItem doc={item} currentDocs={currentUsingDocs} setCurrentDocs={setCurrentUsingDocs} />
                })}
            </div>
        </div>
    )
}

export default DocumentSection


const DocItem = ({ doc, currentDocs, setCurrentDocs }: { doc: DocsInterface, currentDocs: Set<string>, setCurrentDocs: Dispatch<SetStateAction<Set<string>>> }) => {
    // console.log(doc)
    return (
        <div className="document flex gap-1 place-content-start place-items-center w-full bg-white/50 rounded-xs px-2 py-0.5  " >
            <h3 className='text-sm text-start w-full line-clamp-1'>{doc.name}</h3>
            <div className="icon" title={currentDocs.has(doc._id) ? "Remove from Context" : "Add to Context"}>
                {currentDocs.has(doc._id) ? (
                    <MinusCircleIcon
                        className="cursor-pointer "
                        onClick={() =>
                            setCurrentDocs((prev) => {
                                const newSet = new Set(prev)
                                newSet.delete(doc._id)
                                return newSet
                            })
                        }
                        size={20}
                    />
                ) : (
                    <PlusCircleIcon
                        className="cursor-pointer"
                        onClick={() =>
                            setCurrentDocs((prev) => {
                                const newSet = new Set(prev)
                                newSet.add(doc._id)
                                return newSet
                            })
                        }
                        size={20}
                    />
                )}
            </div>
        </div>
    )
}