import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { URIS } from "../lib/constants"
import type { BaseResponse } from "./userApiSlice"
import type { messagesInterface, userChatInterface } from "../pages/components/Chatbox"

interface ChatResponse extends BaseResponse {
    chats: userChatInterface[]
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
    tagTypes:['userChat','chatId'],
    endpoints: (builder) => ({
        getChatId: builder.query<ChatIdResponse, void>({
            query: () => ({
                url: URIS.GET_CHAT_ID,
                method: "GET",
                credentials: 'include'
            }),
            providesTags:["chatId"]
        }),
        getChats: builder.query<ChatResponse, void>({
            query: () => ({
                url: URIS.GET_USER_CHATS,
                method: "GET",
                credentials: 'include'
            }),
            providesTags:["userChat"]
        }),
        updateCurrentChatId: builder.mutation<BaseResponse, string>({
            query: (chatId) => ({
                url: URIS.SET_CHAT_ID,
                method: "POST",
                body: JSON.stringify({ chatId }),
                credentials: 'include'
            })
        }),
        queryChat: builder.mutation<queryResponse, { query: string, creativity: string, selectedChat: string, currentUsingDocs: string }>({
            query: ({ query, creativity, selectedChat, currentUsingDocs }) => ({
                url: URIS.QUERY,
                method: "POST",
                body: JSON.stringify({ query, creativity: creativity, "selected_chat_id": selectedChat, "document_ids": Array.from(currentUsingDocs) }),
                credentials: 'include'
            })
        }),
        newChat: builder.query<ChatIdResponse, void>({
            query: () => ({
                url: URIS.NEW_CHAT,
                method: "GET",
                credentials: 'include'
            })
        })
    })
})

export const { useQueryChatMutation, useGetChatsQuery, useGetChatIdQuery, useUpdateCurrentChatIdMutation, useLazyNewChatQuery } = chatApi