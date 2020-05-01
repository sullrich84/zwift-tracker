import React from "react";
import ReactDOM from "react-dom";
import AchievementTable from "./components/AchievementTable";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import csvFile from "./data/achievements.csv";
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
      {data ? <AchievementTable data={data} /> : <code>Loading...</code>}
    </Container>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
