import BuilderPage from "@/components/UI/BuilderPage";
import DashboardNavigation from "@/components/UI/DashboardNavigation";
import SiteList from "@/components/VIEW/SiteList";

export default function Home() {
  return (
    <DashboardNavigation cssStyle="">
      <SiteList></SiteList>
    </DashboardNavigation>
  );
}
