import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import styles from './styles/app.css';
import type { ReactNode } from "react";
import AppProvider from "./context/AppContext";

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }]
}

function Document({children}: {children: ReactNode}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        className="min-h-screen bg-gradient-to-br from-gray-800 via-primary to-foreground relative bg-no-repeat overflow-hidden"
      >
        <AppProvider>
          <main className="absolute top-0 right-0 bottom-0 left-0 flex flex-col items-center overflow-auto">
            {children}
          </main>
        </AppProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App(){
  return (
    <Document>
      <Outlet/>
    </Document>
  )
}

// export function ErrorBoundary({error}: {error: Error}) {
//   return (
//     <div
//       className="min-h-screen flex flex-col relative items-center bg-gradient-to-br from-gray-800 via-primary to-foreground"
//     >
//       <div className="min-w-full flex flex-col gap-2">
//         <div className="bg-white/70 shadow-lg w-full max-w-5xl mx-auto flex flex-col p-4 rounded-xl min-h-[90vh] relative">
//           <h1>App Error</h1>
//           <pre>{error.message}</pre>
//         </div>
//       </div>
//     </div>
//   );
// }