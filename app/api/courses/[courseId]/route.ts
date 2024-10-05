import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isTeacher } from "@/lib/teacher";

const {video} = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!
});

export async function DELETE(
    req: Request,
    {params} : {params: {courseId: string;}}
) {
    try {
        const {userId} = auth();

        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized", {status : 401});
        }
        
        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            }
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", {status : 401});
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId,
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        });

        if (!course) {
            return new NextResponse("Not found", {status: 404})
        }

        for (const chapter of course.chapters)
        {
            if (chapter.muxData?.assestId) {
                await video.assets.delete(chapter.muxData.assestId);                
            }
        }

        const deleteCourse = await db.course.delete({
            where: {
                id: params.courseId,
            },

        });

        return NextResponse.json(deleteCourse);

    }
    catch (error) {
        console.log("[CHAPTER_ID_DELETE", error);
        return new NextResponse("Internal Error", {status: 500});
    }
    
}

export async function PATCH(
    req: Request,
    {params} : {params : { courseId : string}}    
) {
        try{
            const { userId } = auth();
            const {courseId} = params;
            const values = await req.json();
            if (!userId || !isTeacher(userId)) {
                return new NextResponse("Unauthorized", {status : 401});

            }

            const course = await db.course.update({
                where: {
                    id: courseId,
                    userId
                },
                data: {
                    ...values,
                }
            })

            return NextResponse.json(course);
        }
        catch (error){
            console.log("[COURSE_ID]", error); 
            return new NextResponse("Interal Error", {status : 500});
        }
}