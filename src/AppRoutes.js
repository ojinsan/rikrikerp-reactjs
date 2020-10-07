import React, { Component, Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Sidebar } from "./elements";
import { AHSSumber, HS, AHSProject } from "./pages";

// const Dashboard = lazy(() => import('./dashboard/Dashboard'));
class AppRoutes extends Component {
    render() {
        return (
            <Suspense>
                {/* fallback={<Spinner />}> */}
                <Switch>
                    <Route exact path="/ahs-sumber" component={AHSSumber} />
                    <Route exact path="/hs" component={HS} />
                    <Route exact path="/ahs-project" component={AHSProject} />
                    {/* <Route path="/penjualan" component={ Pembelian } /> */}
                    {/* <Route path="/penjualan" component={ Keuangan } /> */}

                    <Redirect to="/dashboard" />
                </Switch>
            </Suspense>
        );
    }
}

export default AppRoutes;
