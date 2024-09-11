import BuilderPage from "@/components/UI/BuilderPage";
import DashboardNavigation from "@/components/UI/DashboardNavigation";
import Charts from "@/components/VIEW/Charts";
import LoginForm from "@/components/VIEW/LoginForm";


export default function Home() {
  return (
    <DashboardNavigation cssStyle="" >
      <Charts />
    </DashboardNavigation>
  );
}
