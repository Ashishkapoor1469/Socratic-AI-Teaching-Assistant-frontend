"use client"

import { useUserStore, decodeJWT } from "@/store/userStore"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Loader } from "lucide-react"
import api from "@/lib/api"
import Image from "next/image"

const publicRoutes = ["/login", "/signup"]

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, isLoading, setUser } = useUserStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const initUser = async () => {
      if (token && typeof window !== "undefined") {
        const payload = decodeJWT(token)
        if (payload?.email) {
          try {
            const res = await api.post("/user/get", { identifier: payload.email })
            setUser(res.data?.email ? res.data : (res.data?.user || null))
          } catch (err) {
            console.error(err)
            useUserStore.getState().logout()
          }
        } else {
          useUserStore.getState().logout()
        }
      } else {
        useUserStore.setState({ isLoading: false })
      }
    }
    
    initUser()
  }, [token, setUser])

  useEffect(() => {
    if (!isLoading) {
      if (!token && !publicRoutes.includes(pathname)) {
        router.push("/login")
      } else if (token && publicRoutes.includes(pathname)) {
        router.push("/")
      }
    }
  }, [token, isLoading, pathname, router])

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-black">
//         <Loader className="animate-spin text-white" />
//       </div>
//     )
//   }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#212121]">
         <Image 
                    src="/assets/logo-without.webp" 
                    alt="Profile" 
                    width={100}
                    height={100}

                    className="object-cover p-1 animate-pulse" 
                  />
      </div>
    )
  }

  return <>{children}</>
}

export default PrivateRoute
