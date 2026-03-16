import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { URIS } from "../lib/constants"
import type { BaseResponse } from "./userApiSlice"

interface ChatResponse extends BaseResponse {
    id: string,
    name: string,
    messages: {
        "user": string,
        "assistant": string
    }[]
}

interface queryResponse extends BaseResponse {
    response: string,
    name?: string
}

export const chatApi = createApi({
    reducerPath: "chatApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_SERVER_URI,
        credentials: "include"
    }),
    endpoints: (builder) => ({
        getChat: builder.mutation<ChatResponse, void>({
            query: (body) => ({
                url: URIS.GET_CHATS,
                method: "POST",
                body
            })
        }),
        queryChat: builder.mutation<queryResponse, { query: string, creativity: string }>({
            query: ({ query, creativity }) => ({
                url: URIS.QUERY,
                method: "POST",
                body: {
                    query,
                    creativity
                }
            })
        })
    })
})

export const { useQueryChatMutation ,useGetChatMutation} = chatApi