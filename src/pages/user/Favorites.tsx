import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const Favorites: React.FC = () => {
  return (
    <Container>
      <h1>Tour yêu thích</h1>
    </Container>
  );
};

export default Favorites; 