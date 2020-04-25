import React from "react";
import ReactDOM from "react-dom";
import AchivementTable from "./components/AchivementTable";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import csvFile from "./data/achivements.csv";
import { readString } from "react-papaparse";

function App() {
  const [data, setData] = React.useState();

  // Load data from csv file
  React.useEffect(
    () =>
      readString(csvFile, {
        header: true,
        download: true,
        delimiter: ", ",
        dynamicTyping: true,
        complete: (results) => setData(results.data),
      }),
    []
  );

  return (
    <Container maxWidth="md">
      <CssBaseline />
      {data ? <AchivementTable data={data} /> : <code>Loading...</code>}
    </Container>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
