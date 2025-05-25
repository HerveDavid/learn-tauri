import { memo } from "react";
import Table from "./features/table";
import "./App.css";

const App = memo(() => (
  <main>
    <Table />
  </main>
));

export default App;
