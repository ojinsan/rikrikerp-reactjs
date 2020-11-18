import React, { Component, Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Sidebar } from "./elements";
import {
  AHSSumber,
  HS,
  AHSProject,
  RAB,
  RABProjectBagian,
  Project,
  Wilayah,
} from "./pages";

// const Dashboard = lazy(() => import('./dashboard/Dashboard'));
class AppRoutes extends Component {
  render() {
    return (
      <Suspense>
        {/* fallback={<Spinner />}> */}
        <Switch>
          <Route exact path="/wilayah" component={Wilayah} />
          <Route exact path="/ahs-sumber" component={AHSSumber} />
          <Route exact path="/hs" component={HS} />
          <Route
            exact
            path="/project/ahs-project/:tahun/:projectid"
            component={AHSProject}
          />
          <Route
            exact
            path="/project/rab/:tahun/:rabprojectbagianid"
            component={RAB}
          />
          <Route
            exact
            path="/project/rab-project-bagian/:tahun/:projectid"
            component={RABProjectBagian}
          />
          <Route exact path="/project" component={Project} />
          {/* <Route path="/project/rab" component={ Pembelian } />
                    <Route path="/project/" component={ Keuangan } /> */}

          <Redirect to="/dashboard" />
        </Switch>
      </Suspense>
    );
  }
}

export default AppRoutes;
