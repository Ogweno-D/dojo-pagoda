import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { routeTree } from "./routeTree.gen";
import {
    createRouter,
    RouterProvider,
    ErrorComponent,
} from "@tanstack/react-router";
import { ToastProvider } from "./context/Toast/ToastProvider";
import { AuthProvider, useAuth } from "./context/auth/AuthContext";
import { MantineProvider } from "@mantine/core";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 30,
            retry: 2,
            refetchOnWindowFocus: true,
        },
    },
});

const router = createRouter({
    routeTree,
    context: {
        auth: undefined!,
    },
    defaultPreload: "intent",
    defaultNotFoundComponent: () => (
        <div>
            <div>Page Not Found</div>
            <div>404 Not Found</div>
        </div>
    ),
    defaultErrorComponent: ({ error }) => {
        if (error instanceof Error) {
            return (
                <div>
                    <div>Error!</div>
                    <div>{error.message}</div>
                </div>
            );
        }
        return <ErrorComponent error={error} />;
    },
});

// Extend module
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

function AppRouter() {
    const auth = useAuth();
    return <RouterProvider router={router} context={{ auth }} />;
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <MantineProvider withCssVariables withGlobalClasses>
            <ToastProvider position="top-right">
                <AuthProvider>
                    <QueryClientProvider client={queryClient}>
                        <AppRouter />
                        <ReactQueryDevtools initialIsOpen={false} />
                    </QueryClientProvider>
                </AuthProvider>
            </ToastProvider>
        </MantineProvider>
    </StrictMode>
);
