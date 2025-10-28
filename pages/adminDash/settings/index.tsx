import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import SettingsComponent from "./components/SettingsComponent";

export default function SettingsPage() {

   
  return (
    <DashboardLayout>
      <h1>Configuración</h1>
      <p>Ajustes de la cuenta y preferencias.</p>
      <SettingsComponent />
    </DashboardLayout>
  );
}
