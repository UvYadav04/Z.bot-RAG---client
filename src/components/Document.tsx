import { Loader, MinusCircleIcon, PlusCircleIcon, Upload } from 'lucide-react'
import React, { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { useGetDocumentsQuery, useUploadDocumentMutation } from '../services/documentApiSlice';
import { toast } from 'sonner';
interface DocsInterface {
    name: string,
    id: string,
    date?: string
}
const docs: DocsInterface[] = [
    { name: "System Design Fundamentals", id: "doc_001", date: "2026-02-01" },
    { name: "Load Balancing Techniques", id: "doc_002", date: "2026-02-03" },
    { name: "Distributed Caching Guide", id: "doc_003", date: "2026-02-05" },
    { name: "Microservices Architecture", id: "doc_004", date: "2026-02-07" },
    { name: "API Gateway Patterns", id: "doc_005", date: "2026-02-09" },
    { name: "Database Sharding Explained", id: "doc_006", date: "2026-02-11" },
    { name: "Message Queue Systems", id: "doc_007", date: "2026-02-13" },
    { name: "Event Driven Architecture", id: "doc_008", date: "2026-02-15" },
    { name: "Designing Rate Limiters", id: "doc_009", date: "2026-02-17" },
    { name: "Consistent Hashing Notes", id: "doc_010", date: "2026-02-19" },
    { name: "Scaling Web Applications", id: "doc_011", date: "2026-02-21" },
    { name: "Building a CDN", id: "doc_012", date: "2026-02-23" },
    { name: "Authentication vs Authorization", id: "doc_013", date: "2026-02-25" },
    { name: "OAuth and JWT Overview", id: "doc_014", date: "2026-02-27" },
    { name: "Streaming Data Pipelines", id: "doc_015", date: "2026-03-01" },
    { name: "Search Engine Architecture", id: "doc_016", date: "2026-03-03" },
    { name: "Video Streaming Systems", id: "doc_017", date: "2026-03-05" },
    { name: "Real Time Chat System Design", id: "doc_018", date: "2026-03-07" },
    { name: "Monitoring and Observability", id: "doc_019", date: "2026-03-09" },
    { name: "Fault Tolerance Strategies", id: "doc_020", date: "2026-03-11" },
];
function DocumentSection() {

    const { data } = useGetDocumentsQuery()
    const [uploadedDocs, setUploadedDocs] = useState<DocsInterface[]>([])
    const [uploadingDocs, setUploadingDocs] = useState<File[] | null>(null)
    const [currentUsingDocs, setCurrentUsingDocs] = useState<Set<string>>(new Set())
    const docRef = useRef<HTMLInputElement | null>(null)
    const [uploadDocs, { isLoading }] = useUploadDocumentMutation()

    console.log(data)

    const uploadDocuments = async (files: FileList) => {
        try {
            if (!files)
                throw new Error("Please select valid files")
            console.log(files)
            const formData = new FormData()
            const fileList = Array.from(files);
            setUploadingDocs(fileList);

            fileList.forEach((file) => {
                formData.append("files", file);
            });

            const { documents, success, message } = await uploadDocs({ formData }).unwrap();

            if (!success)
                throw new Error(message)
            let ids = Array.from(documents).map((item) => item.id)
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
        if (data?.documents)
            setUploadedDocs(data.documents)
    }, [data])

    return (
        <div className="docs w-full  flex flex-col place-content-start gap-2 place-items-center h-full px-0 py-1 bg-white overflow-y-scroll" style={{ scrollbarWidth: "none" }}>
            <h3 className='border-2 border-(--border) w-full text-center text-(--text) flex flex-row place-content-center place-items-center gap-4 group cursor-pointer' onClick={() => docRef.current?.click()}>
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
            <div className="docs w-full flex flex-col gap-1 h-full overflow-y-scroll" style={{ scrollbarWidth: "none" }}>
                {uploadingDocs?.map((item) => {
                    return <div className="document flex gap-1 place-content-start place-items-center w-full border border-slate-200 px-2 py-0.5  " >
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
    return (
        <div className="document flex gap-1 place-content-start place-items-center w-full border border-slate-200 px-2 py-0.5  " >
            <h3 className='text-sm text-start w-full line-clamp-1'>{doc.name}</h3>
            <div className="icon" title={currentDocs.has(doc.id) ? "Remove from Context" : "Add to Context"}>
                {currentDocs.has(doc.id) ? (
                    <MinusCircleIcon
                        className="cursor-pointer "
                        onClick={() =>
                            setCurrentDocs((prev) => {
                                const newSet = new Set(prev)
                                newSet.delete(doc.id)
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
                                newSet.add(doc.id)
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