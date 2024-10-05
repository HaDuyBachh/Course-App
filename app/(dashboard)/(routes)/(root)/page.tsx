import { getDashboardCourse } from "@/action/get-dashboard-courses";
import { CourseList } from "@/components/course-list";
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";
import { InfoCard } from "./_component/info-card";
import { Clock, Info } from "lucide-react";


export default async function Dashboard() {
  const {userId} = auth();
  
  if (!userId) {
    return redirect("/");
  }

  const {
    completedCourses,
    coursesInProgress,
  } = await getDashboardCourse(userId);

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard
              icon = {Clock}
              label = "In Progress" 
              numberOfItems = {coursesInProgress.length}
            />

            <InfoCard
              icon = {Clock}
              label= "Completed"
              numberOfItems = {completedCourses.length}
              variant = "success"
            />
      </div>

      <CourseList
        items={[...coursesInProgress,...completedCourses]}  
      >

      </CourseList>
    </div>
  )
}
