import {createFileRoute, Outlet} from '@tanstack/react-router'
import {useState} from "react";
import {Sidebar} from "../components/Sidebar/Sidebar.tsx";
import { Footer } from '../components/Footer/Footer.tsx';
import Navbar from '../components/Navbar/Navbar.tsx';

export const Route = createFileRoute('/_protected')({
    component: RouteComponent,
    // beforeLoad: ({ context }) => {
    //     if (!context.auth.isAuthenticated()) {
    //         throw redirect({
    //             to: '/login'
    //         });
    //     }
    // },
})

function RouteComponent() {

  const [collapsed, setCollapsed] = useState(true);

  return (
      <div className={`main-layout ${collapsed ? "collapsed" : ""}`}>
          <Navbar/>
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          <main className={"main-content-container"} >
              <div className={"main-content"}>
                  <Outlet />
              </div>
          </main>
          <footer className={"footer"}>
              <Footer />
          </footer>
      </div>
  )
}

