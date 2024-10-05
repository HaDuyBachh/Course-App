"use client";

import { BarChart, Compass, Layout, List, Sidebar } from "lucide-react"
import { Herr_Von_Muellerhoff } from "next/font/google"
import { SidebarItem } from "./sidebar-item"
import { usePathname } from "next/navigation";

const guestRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/",  
    },
    {
        icon: Compass,
        label: "Browse",
        href: "/search",
    }
]

const teacherRoutes = [
    {
        icon: List,
        label: "Courses",
        href: "/teacher/courses",  
    },
    {
        icon: BarChart,
        label: "Analytics",
        href: "/teacher/analytics",
    }
]

export const SidebarRoutes = () => {

    const pathname = usePathname();

    const isTeacherPage =pathname?.includes("/teacher");
    
    const routes = isTeacherPage ? teacherRoutes : guestRoutes;

    //const routes = guestRoutes;

    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem 
                    key = {route.href}
                    icon = {route.icon}
                    label = {route.label}
                    href = {route.href}
                />
            ) )}
            
        </div>
    )
}