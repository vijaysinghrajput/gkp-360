import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Layout from "../components/layout/Layout";
import theme from "../theme/theme";
import { AuthProvider } from "../context/AuthContext";

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <ThemeProvider theme={theme}>
      <SessionProvider session={session}>
        <AuthProvider>
          <CssBaseline />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
