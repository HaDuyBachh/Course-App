"use client";

import { ConfirmModal } from "@/components/modal/confirm-modal";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Confetti from "react-confetti/dist/types/Confetti";
import toast from "react-hot-toast";

interface ActionProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
};

export const Action = ({
    disabled,
    courseId,
    isPublished
} : ActionProps) => 
{
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter();
    const confetti = useConfettiStore();

    const onClick = async() => {
        try {
            setIsLoading(true);

            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/unpublish`);
                toast.success("Course unpublished");   
                router.refresh();
            }
            else
            {
                await axios.patch(`/api/courses/${courseId}/publish`);
                toast.success("Course published");
                router.refresh();
                confetti.onOpen();
            }
        }
        catch {
            toast.error("Something went wrong");
        }
        finally {
            setIsLoading(false);
        }
    }

    const onDelete = async() => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/courses/${courseId}`);
            toast.success("Course deleted")
            router.refresh();
            router.push(`/teacher/courses/`);
            router.refresh();
        }
        catch {
            toast.error("Something went wrong");
        }
        finally {
            setIsLoading(false);
        }


    }
    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled = {disabled || isLoading}
                variant="outline"
                size={"sm"}
            >
                {isPublished ? "Unpublish" : "Pulish"}
            </Button>

            <ConfirmModal onConfirm={onDelete}>
                <Button size = "sm">
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    )
}