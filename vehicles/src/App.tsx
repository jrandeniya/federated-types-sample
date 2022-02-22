import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";

const CarsButton = lazy(() => import("cars/Button"));

const Home = () => (
  <div className="flex flex-col items-start justify-center h-screen p-20 bg-gray-900">
    <h1 className="mb-6 text-5xl text-white">Hello from Vehicles 👋</h1>
    <Suspense fallback="Loading...">
      <CarsButton consumer="Vehicles" />
    </Suspense>
  </div>
);

const App = () => (
  <>
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
      </Switch>
    </Router>
  </>
);

export default App;
