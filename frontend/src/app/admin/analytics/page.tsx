import { Metadata } from "next";
import { fetchClient } from "@/lib/api/client";
import { AnalyticsClient } from "./AnalyticsClient";

export const metadata: Metadata = {
  title: "Analytics | Admin",
  description: "View visitor interactions and events.",
};

export default async function AnalyticsPage(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams.page || "1", 10);
  const limit = 50;
  const offset = (page - 1) * limit;

  let summaryData = { summary: {}, total: 0 };
  let eventsData = { items: [], total: 0, limit, offset };

  try {
    const [summaryRes, eventsRes] = await Promise.all([
      fetchClient<any>("/api/v1/admin/analytics/summary", { next: { tags: ["analytics"], revalidate: 0 } }),
      fetchClient<any>(`/api/v1/admin/analytics?limit=${limit}&offset=${offset}`, { next: { tags: ["analytics"], revalidate: 0 } })
    ]);
    
    if (summaryRes) summaryData = summaryRes;
    if (eventsRes) eventsData = eventsRes;
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
  }

  return (
    <AnalyticsClient 
      initialSummary={summaryData} 
      initialEvents={eventsData} 
      currentPage={page} 
    />
  );
}
