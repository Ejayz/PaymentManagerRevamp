import DashboardNavigation from "@/components/UI/DashboardNavigation";
import ManualPaymentList from "@/components/VIEW/ManualPaymentList";

export default function Home() {
  return (
    <DashboardNavigation cssStyle="">
      <ManualPaymentList />
    </DashboardNavigation>
  );
}
