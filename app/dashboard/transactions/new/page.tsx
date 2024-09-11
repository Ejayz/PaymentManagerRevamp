import DashboardNavigation from "@/components/UI/DashboardNavigation";
import NewTransaction from "@/components/VIEW/NewTransaction";

export default function Home() {
  return (
    <DashboardNavigation cssStyle="">
      <NewTransaction />
    </DashboardNavigation>
  );
}
