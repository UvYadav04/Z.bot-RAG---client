import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

const documentsSlice = createSlice({
    name: "documents",
    initialState: {
        currentDocuments: [] as string[]
    },
    reducers: {
        addDocument: (state, action: PayloadAction<{ documentId: string }>) => {
            const documentId = action.payload.documentId
            state.currentDocuments.push(documentId)
        }
    }
})

export const { addDocument } = documentsSlice.actions
export default documentsSlice.reducer