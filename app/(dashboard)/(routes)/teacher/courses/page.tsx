import { Button } from "@/components/ui/button";
import  Link  from "next/link";
import { DataTable } from "./_component/data-table";
import { columns } from "./_component/columns";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {db} from "@/lib/db"


const CoursesPage = async() => {
    const {userId} = auth();

    if (!userId) {
        return redirect("/");
    }

    const course = await db.course.findMany({
        where:{
            userId,
        },
        orderBy: {
            createdAt: "desc",
        }
    })

    return ( 
        <div className="p-6">
            <DataTable columns={columns} data={course} />
        </div>
    )
}

export default CoursesPage;