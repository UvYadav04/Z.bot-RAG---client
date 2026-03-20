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
            setCurrentUsingDocs(new Set())
            setSelectedChat(null)
        } catch (error: any) {
            toast.error(error?.message || error?.data?.message || "cant log out at the moment")
        }
    }

    if (loggingIn || isLoading || loggingOut || (errorInfo && isFetching))
        return <div className="w-full text-center place-content-center place-items-center googleLogin float-end mt-auto mb-0 p-1 max-h-[10%]" >
            <LoaderIcon size={25} className="animate-spin w-fit my-2 rounded-full" />
        </div>


    if (errorInfo && !isFetching)
        return <Button
            variant="secondary"
            size="sm"
            onClick={refetch}
            className="text-xs flex place-content-center place-items-center cursor-pointer float-end mt-auto mb-1 p-1 max-h-[10%]"
        >
            <h2>Retry loading user Info</h2>
            <RotateCcw />
        </Button>


    return (
        <div className="googleLogin float-end mt-auto w-full mb-0 p-1 h-fit">
            {!userInfo ? (
                <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                        const decoded: any = jwtDecode(credentialResponse.credential || "")
                        const { success, message } = await login({
                            email: decoded.email,
                            name: decoded.name
                        }).unwrap()
                        if (!success)
                            throw new Error(message)
                        setCurrentUsingDocs(new Set())
                        setSelectedChat(null)
                        toast.success("Logged in successfully")
                    }}
                    onError={() => {
                        toast.error("cant log in at the moment")
                    }}
                />
            )
                : (
                    <div className="flex items-center gap-2 text-xl group bg-white/60 p-2 rounded-sm">
                        <div className="size-6 rounded-full flex place-content-center place-items-center bg-amber-300 text-sm font-bold">{userInfo?.name.charAt(0)}</div>
                        <span className="text-sm">{userInfo?.name}</span>
                        <span className="hidden group-hover:block cursor-pointer ms-auto me-2 text-red-500"><LogOut onClick={() => handleLogOut()} size={20} /></span>
                    </div>
                )}

        </div>
    )
}

export default UserProfile