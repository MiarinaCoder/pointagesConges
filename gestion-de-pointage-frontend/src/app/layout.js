import { AuthProvider } from "../context/authContext";

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider> 
      </body>
    </html>
  );
}