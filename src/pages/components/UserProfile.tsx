import { jwtDecode } from "jwt-decode"
import { GoogleLogin } from "@react-oauth/google"
import { useGetUserInfoQuery, useLoginMutation, useLogoutMutation } from "../../services/userApiSlice"
import { LoaderIcon, LogOut, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { useChatContext } from "../../context/chatContext"
import { Button } from "../../components/ui/button"

function UserProfile() {

    const { data, isLoading, isFetching, error: errorInfo, refetch } = useGetUserInfoQuery()
    const { info: userInfo } = data || {}
    const [login, { isLoading: loggingIn }] = useLoginMutation()
    const [logOut, { isLoading: loggingOut }] = useLogoutMutation()
    const { setCurrentUsingDocs, setSelectedChat } = useChatContext()

    const handleLogOut = async () => {
        try {
            const { success, message } = await logOut().unwrap()
            if (!success)
                throw new Error(message || "cant logout at the moment")
            setCurrentUsingDocs(undefined)
            setSelectedChat(null)
        } catch (error: any) {
            toast.error(error?.message || error?.data?.message || "cant log out at the moment")
        }
    }

    // UI FIXED VERSION

    if (loggingIn || isLoading || loggingOut || (errorInfo && isFetching))
        return (
            <div className="w-full flex items-center justify-center py-3">
                <LoaderIcon className="animate-spin text-orange-500" size={22} />
            </div>
        )

    if (errorInfo && !isFetching)
        return (
            <Button
                variant="secondary"
                size="sm"
                onClick={refetch}
                className="w-full flex items-center justify-center gap-2 text-xs"
            >
                Refetch User Info
                <RotateCcw size={14} />
            </Button>
        )

    return (
        <div className="w-full mt-auto pt-3 border-t border-border">

            {!userInfo ? (
                <GoogleLogin

                    onSuccess={async (credentialResponse) => {
                        const decoded: any = jwtDecode(credentialResponse.credential || "")
                        const { success, message } = await login({
                            email: decoded.email,
                            name: decoded.name
                        }).unwrap()

                        if (!success) throw new Error(message)

                        setCurrentUsingDocs(undefined)
                        setSelectedChat(null)
                        toast.success("Logged in successfully")
                    }}
                    onError={() => {
                        toast.error("cant log in at the moment")
                    }}
                />
            ) : (
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-background/80 backdrop-blur border border-border shadow-sm">

                    {/* avatar */}
                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold">
                        {userInfo?.name?.charAt(0)}
                    </div>

                    {/* name */}
                    <span className="text-sm font-medium truncate">
                        {userInfo?.name}
                    </span>

                    {/* logout */}
                    <button
                        onClick={handleLogOut}
                        className="ml-auto p-1 rounded-md hover:bg-muted transition-all"
                    >
                        <LogOut size={16} className="text-muted-foreground hover:text-red-500" />
                    </button>
                </div>
            )}
        </div>
    )
}

export default UserProfile