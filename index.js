import React from 'react';
import ReactDOM from 'react-dom';
import AchivementTable from './src/AchivementTable';
import Container from '@material-ui/core/Container';

function App() {
  return (
    <Container maxWidth="md">
      <AchivementTable />
    </Container>
  );
}

ReactDOM.render(<App />, document.querySelector('#app'));
