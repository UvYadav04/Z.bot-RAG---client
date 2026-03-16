import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { URIS } from "../lib/constants"
import type { BaseResponse } from "./userApiSlice"

interface DocumentResponse extends BaseResponse {
    documents: {
        id: string;
        name: string;
    }[];
}

export const documentApi = createApi({
    reducerPath: "documentApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_SERVER_URI,
        credentials: "include"
    }),
    tagTypes: ["Documents"],
    endpoints: (builder) => ({

        getDocuments: builder.query<DocumentResponse, void>({
            query: () => URIS.GET_DOCUMENTS,
            providesTags: ["Documents"]
        }),

        uploadDocument: builder.mutation<DocumentResponse, { formData: FormData }>({
            query: ({ formData }) => ({
                url: URIS.UPLOAD_DOCUMENT,
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["Documents"]
        }),

        deleteDocument: builder.mutation<BaseResponse, { documentId: string }>({
            query: ({ documentId }) => ({
                url: URIS.DELETE_DOCUMENT(documentId),
                method: "DELETE"
            }),
            invalidatesTags: ["Documents"]
        }),

    })
})

export const {
    useGetDocumentsQuery,
    useUploadDocumentMutation,
    useDeleteDocumentMutation
} = documentApi