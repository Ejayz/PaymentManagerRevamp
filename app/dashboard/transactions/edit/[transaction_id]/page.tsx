import DashboardNavigation from "@/components/UI/DashboardNavigation";
import EditTransaction from "@/components/VIEW/EditTransaction";

export default function Home({
  params,
}: {
  params: { transaction_id: string };
}) {
  return (
    <DashboardNavigation cssStyle="">
      <EditTransaction transaction_id={params.transaction_id} />
    </DashboardNavigation>
  );
}
