import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {routeTree} from './routeTree.gen'
import {createRouter, ErrorComponent, RouterProvider} from "@tanstack/react-router";
import {ToastProvider} from "./context/Toast/ToastProvider.tsx";
import { useAuth} from "./context/auth/AuthContext.tsx";
import {AuthProvider} from "./context/auth/AuthContext.tsx";
import { MantineProvider } from '@mantine/core';


const router = createRouter({
    routeTree,
    context: {
        auth: undefined!
    },
    defaultPreload :'intent',
    defaultNotFoundComponent: () => {
        return (
            <div>
                <div> Page Not Found</div>
                <div> 404 Not Found</div>

            </div>
        )
    },
    defaultErrorComponent: ({error}) => {
        if(error instanceof  Error){
            return (
                <div>
                    <div> Error !</div>
                    <div> {error.message}</div>
                </div>
            )
        }

        return <ErrorComponent error={error} />
    }
});


declare  module '@tanstack/react-router' {
    interface Register{
        router: typeof router
    }
}

export  function Router(){
    const auth = useAuth();
    return <RouterProvider router={router} context={{auth}}/>
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <MantineProvider withCssVariables={true} withGlobalClasses={true}>
          <ToastProvider position="top-right">
              <AuthProvider>
                    <Router />
                  {/*<RouterProvider router={router}></RouterProvider>*/}
              </AuthProvider>
          </ToastProvider>
      </MantineProvider>
  </StrictMode>,
)
