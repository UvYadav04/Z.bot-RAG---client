import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { URIS } from "../lib/constants"
import type { BaseResponse } from "./userApiSlice"

interface DocumentResponse extends BaseResponse {
    documents: {
        _id: string;
        name: string;
    }[];
}

export const documentApi = createApi({
    reducerPath: "documentApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_SERVER_URI,
    }),
    tagTypes: ["Documents"],
    endpoints: (builder) => ({

        getDocuments: builder.query<DocumentResponse, void>({
            query: () => ({
                url: URIS.GET_DOCUMENTS,
                method: "GET",
                credentials: 'include',
                timeout:10000
            }),
            providesTags: ["Documents"]
        }),

        uploadDocument: builder.mutation<DocumentResponse, { formData: FormData }>({
            query: ({ formData }) => ({
                url: URIS.UPLOAD_DOCUMENT,
                method: "POST",
                body: formData,
                credentials: 'include',
            }),
            invalidatesTags: ["Documents"]
        }),

        deleteDocument: builder.mutation<BaseResponse, { documentId: string }>({
            query: ({ documentId }) => ({
                url: URIS.DELETE_DOCUMENT(documentId),
                method: "DELETE",
                credentials: 'include',
                timeout:10000
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