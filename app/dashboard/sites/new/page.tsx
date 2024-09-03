import DashboardNavigation from "@/components/UI/DashboardNavigation";
import NewSiteForm from "@/components/VIEW/NewSiteForm";
import SiteList from "@/components/VIEW/SiteList";

export default function NewSitePage() {
  return (
    <DashboardNavigation cssStyle="">
      <NewSiteForm />
    </DashboardNavigation>
  );
}
