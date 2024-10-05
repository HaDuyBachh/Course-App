import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getAnalytics } from "@/action/get-analystics";
import { DataCard } from "./_component/data-card";
import { Chart } from "./_component/chart";

const AnalyticsPage = async() => {

    const {userId} = auth();
    if (!userId) {
        redirect("/");
    }

    const {
        data,
        totalRevenue,
        totalSales,
    } = await getAnalytics(userId);

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <DataCard
                    label="Total Revenuce"
                    value={totalRevenue}
                    shouldFormat
                />
                <DataCard
                    label="Total Sales"
                    value={totalSales}
                />
                <Chart
                    data={data}
                />
            </div>
        </div>
    )
}

export default AnalyticsPage;