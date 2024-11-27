export const metadata = {
  title: 'Gestion de Pointage',
  description: 'Application de gestion de pointage des employés',
}
import { AuthProvider } from "../context/authContext";

export default function Layout({ children }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>{children}</AuthProvider> 
      </body>
    </html>
  );
}