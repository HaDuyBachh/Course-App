import { Category, Course } from "@prisma/client";

import { getProgress } from "./get-progress";

import { db } from "@/lib/db";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: {id : string}[];
    progress: number | null;
};

type GetCourses = {
    userId : string;
    title?: string;
    categoryId?: string;
};

export const getCourses = async({
    userId,
    title,
    categoryId
} : GetCourses ): Promise<CourseWithProgressWithCategory[]> => {
    try {
        const course = await db.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title,
                },
                categoryId,
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished: true,
                    },
                    select: {
                        id: true,
                    }
                },
                purchases: {
                    where: {
                        userId,
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            }
        });

        const CourseWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
            course.map(async course => {
                if (course.purchases.length == 0) {
                    return {
                        ...course,
                        progress: null,
                    }
                }
                
                const progressPercentage = await getProgress(userId, course.id) 

                return {
                    ...course,
                    progress: progressPercentage,
                }
        }))

        return CourseWithProgress;
    }
    catch (error)
    {
        console.log("[GET_COURSE", error);
        return [];
    }
}