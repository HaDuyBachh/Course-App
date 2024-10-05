import { db } from "@/lib/db";
import { Categories } from "./_component/categories";
import React from "react";
import { SearchInput } from "@/components/search-input";
import { getCourses } from "@/action/get-course";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { CourseList } from "@/components/course-list";

interface SearchPageProps {
    searchParams: {
        title: string;
        categoryId: string;
    }
};

const searchPage = async({
    searchParams
} : SearchPageProps) => {

    const {userId} = auth();
    
    if (!userId) {
        return redirect("/");
    }

    const categories = await db.category.findMany({
            orderBy: {
            name: "asc"
        }
    });


    const courses = await getCourses({
        userId,
         ...searchParams,
    })

    return ( 
        <>
            <div className="px-6 pt-6 md:hidden md:mb-0 block">
                <SearchInput/>
            </div>

            <div className="p-6">
                <Categories 
                    items = {categories}
                />

                <CourseList items={courses}/>
            </div>
        </>
     );
}
 
export default searchPage;