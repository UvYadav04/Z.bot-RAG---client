import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { URIS } from '../lib/constants'

export interface BaseResponse {
    success: boolean,
    message?: string,
    error?: any,
    isError: boolean
}

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_SERVER_URI,
        credentials: 'include'
    }),
    tagTypes: ["User"],
    endpoints: (builder) => ({

        getUserInfo: builder.query<{ success: boolean, info: { name: string, userId: string, email: string } }, void>({
            query: () => ({
                url: URIS.USER_INFO,
                credentials: 'include'
            }),

            providesTags: ["User"]
        }),

        login: builder.mutation<BaseResponse, { email: string, name: string }>({
            query: ({ email, name }) => ({
                url: URIS.LOGIN,
                method: "POST",
                body: { email, name },
                credentials: 'include'
            }),
            invalidatesTags: ["User"]
        }),

        logout: builder.mutation<BaseResponse, void>({
            query: () => ({
                url: URIS.LOGOUT,
                method: "POST",
                credentials: 'include'
            }),
            invalidatesTags: ["User"]
        })

    })
})

export const {
    useGetUserInfoQuery,
    useLoginMutation,
    useLogoutMutation
} = userApi