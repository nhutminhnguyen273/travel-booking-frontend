import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
`;

function App() {
  return (
    <AppContainer>
      <Outlet />
    </AppContainer>
  );
}

export default App;