import React from 'react';
import ReactDOM from 'react-dom';
import AchivementTable from './src/AchivementTable';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

function App() {
  return (
    <Container maxWidth="md">
      <CssBaseline />
      <AchivementTable />
    </Container>
  );
}

ReactDOM.render(<App />, document.querySelector('#app'));
