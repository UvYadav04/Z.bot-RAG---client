export const endPoints = {
    USER: '/user',
    DOCUMENTS: '/document',
    CHAT: '/chat'
}

export const URIS = {
    USER_INFO: `${endPoints.USER}/userInfo`,
    LOGIN: `${endPoints.USER}/login`,
    LOGOUT: `${endPoints.USER}/logout`,
    GET_DOCUMENTS: `${endPoints.DOCUMENTS}/documents`,
    UPLOAD_DOCUMENT: `${endPoints.DOCUMENTS}/upload_document`,
    DELETE_DOCUMENT: (id: string) => `${endPoints.DOCUMENTS}/${id}`,
    GET_CHATS: `${endPoints.CHAT}/getChats`,
    QUERY: `${endPoints.CHAT}/query`,
}