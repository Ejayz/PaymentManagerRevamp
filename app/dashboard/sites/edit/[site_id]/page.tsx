import DashboardNavigation from "@/components/UI/DashboardNavigation";
import EditSiteForm from "@/components/VIEW/EditSiteForm";

export default function Home({ params }: { params: { site_id: string } }) {
  return (
    <DashboardNavigation cssStyle="">
      <EditSiteForm site_id={params.site_id} />
    </DashboardNavigation>
  );
}
