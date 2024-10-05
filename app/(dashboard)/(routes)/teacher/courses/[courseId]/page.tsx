import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { CircleDollarSign, File, Icon, LayoutDashboard, ListCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { boolean } from "zod";
import { TitleForm } from "./_component/title-form";
import { Description } from "@radix-ui/react-dialog";
import { DescriptionForm } from "./_component/description-form";
import { ImageForm } from "./_component/image-form";
import { CategoryForm } from "./_component/category-form";
import { Label } from "@radix-ui/react-label";
import { PriceForm } from "./_component/price-form";
import { AttachmentForm } from "./_component/attachment-form";
import { ChaptersForm } from "./_component/chapter-form";
import React from "react";
import { Banner } from "@/components/banner";
import { Action } from "./_component/action";

const CourseIdPage = async(
    {params} : {params: {courseId: string}
}) => {

    const { userId } = auth();
    if (!userId) 
    {
        return redirect("/");
    }


    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
            userId,
        },

        include: {
            chapters: {
                orderBy: {
                    position: "asc",
                },
            },
            attachments: {
                orderBy: {
                    creatAt: "desc",
                },
            },
        },
    })


    const categories = await db.category.findMany({
        orderBy: {
            name: "asc",
        },
    });

    if (!course) {
        return redirect("/");
    }

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        course.chapters.some(chapter => chapter.isPublished),
    ]

    const totalFields = requiredFields.length;
    const completeFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completeFields} / ${totalFields})`
    const isComplete = requiredFields.every(Boolean);

    return (
        <>
            {!course.isPublished && (
                <Banner
                    label="This course is unpublishd. It will be not visible to students."
                />
            )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-2xl font-medium">
                            Course setup
                        </h1>

                        <span className="text-sm text-slate-700">
                            Complete all fiels {completionText}
                        </span>
                    </div>
                    <Action
                        disabled = {!isComplete}
                        courseId = {params.courseId}
                        isPublished = {course.isPublished}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-x-2"> 
                            <IconBadge icon = {LayoutDashboard}/>
                            <h2 className="text-xl">
                                Customize your course
                            </h2>
                        </div>

                        <TitleForm
                            initialData = {course}
                            courseId = {course.id}
                        />

                        <DescriptionForm
                            initialData = {course}
                            courseId = {course.id}
                        />

                        <ImageForm
                            initialData = {course}
                            courseId = {course.id}
                        />

                        <CategoryForm
                            initialData={course}
                            courseId={course.id} 
                            options={categories.map((category) => ({
                                label: category.name,
                                value: category.id,
                            }))}       
                        />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon = {ListCheck} />
                                <h2 className="text-xl">
                                    Course chapters
                                </h2>
                            </div>  

                            <ChaptersForm
                                initialData={course}
                                courseId={course.id}
                            />
                        </div>

                            <div>
                                <div className="flex items-center gap-x-2">
                                    <IconBadge icon={CircleDollarSign} />
                                    <h2 className="text-xl">
                                        Sell your course
                                    </h2>
                                </div>
                            </div>

                            <PriceForm
                                initialData={course}
                                courseId={course.id}
                            />
                    </div>

                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={File} />
                            <h2 className="text-xl">
                                Recources & Attachments
                            </h2>
                        </div>

                        <AttachmentForm
                            initialData={course}
                            courseId={course.id}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default CourseIdPage;