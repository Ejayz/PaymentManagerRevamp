import DashboardNavigation from "@/components/UI/DashboardNavigation";
import ViewTransaction from "@/components/VIEW/ViewTransaction";

export default function Home({
  params,
}: {
  params: { transaction_id: string };
}) {
  return (
    <DashboardNavigation cssStyle="">
      <ViewTransaction transaction_id={params.transaction_id} />
    </DashboardNavigation>
  );
}
