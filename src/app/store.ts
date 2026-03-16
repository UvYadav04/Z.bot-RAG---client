import { configureStore } from "@reduxjs/toolkit"
import documentReducer from '../redux/userSlice'
import {chatApi} from '../services/chatApiSlice'
import {documentApi} from '../services/documentApiSlice'
import {userApi} from '../services/userApiSlice'
export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [chatApi.reducerPath]: chatApi.reducer,
        [documentApi.reducerPath]: documentApi.reducer,
        document: documentReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([userApi.middleware,chatApi.middleware,documentApi.middleware])
})