import DashboardNavigation from "@/components/UI/DashboardNavigation";
import EditTokenForm from "@/components/VIEW/EditTokenForm";

export default function Home({ params }: { params: { token_id: string } }) {
  return (
    <DashboardNavigation cssStyle="">
      <EditTokenForm token_id={params.token_id} />
    </DashboardNavigation>
  );
}
