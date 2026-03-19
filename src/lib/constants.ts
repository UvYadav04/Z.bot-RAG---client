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
    GET_USER_CHATS:  `${endPoints.CHAT}/getChats`,
    SET_CHAT_ID:  `${endPoints.CHAT}/setChatId`,
    GET_CHAT_ID: `${endPoints.CHAT}/getChatId`,
    QUERY: `${endPoints.CHAT}/query`,
    NEW_CHAT:`${endPoints.CHAT}/newChat`
}