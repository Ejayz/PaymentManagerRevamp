import DashboardNavigation from "@/components/UI/DashboardNavigation";
import NewTokenForm from "@/components/VIEW/NewTokenForm";

export default function Home() {
  return (
    <DashboardNavigation cssStyle="">
      <NewTokenForm />
    </DashboardNavigation>
  );
}
