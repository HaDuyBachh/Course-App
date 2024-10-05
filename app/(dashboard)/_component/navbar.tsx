import { NavbarRoutes } from "@/components/navbar-router"
import { MobileSiderbar } from "./mobile-siderbar"

export const Navbar = () => {
    return (
        <div className="p-4 border-b h-full flex items-center bg-white shadow-sm"> 
            <MobileSiderbar/>
            <NavbarRoutes/>
        </div>
    )
}