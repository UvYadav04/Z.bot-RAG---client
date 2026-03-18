import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { URIS } from "../lib/constants"
import type { BaseResponse } from "./userApiSlice"
import type { messagesInterface, userChatInterface } from "../components/Chatbox"

interface ChatResponse extends BaseResponse {
    chats:userChatInterface[]
}

interface ChatIdResponse extends BaseResponse {
    chatId: string
}

interface queryResponse extends BaseResponse {
    response: string,
    name?: string
}

export const chatApi = createApi({
    reducerPath: "chatApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_SERVER_URI,
    }),
    endpoints: (builder) => ({
        getChatId: builder.query<ChatIdResponse, void>({
            query: () => ({
                url: URIS.GET_CHAT_ID,
                method: "GET",
                credentials: 'include'
            })
        }),
        getChats: builder.query<ChatResponse,void>({
            query: () => ({
                url: URIS.GET_USER_CHATS,
                method: "GET",
                credentials: 'include'
            })
        }),
        queryChat: builder.mutation<queryResponse, { query: string, creativity: string }>({
            query: ({ query, creativity }) => ({
                url: URIS.QUERY,
                method: "POST",
                body: {
                    query,
                    creativity
                },
                credentials: 'include'
            })
        })
    })
})

export const { useQueryChatMutation, useGetChatsQuery,useGetChatIdQuery } = chatApi