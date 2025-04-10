import React from 'react';
import styled from 'styled-components';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const CardWrapper = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.shadows.sm};
  padding: ${(props) => props.theme.spacing.lg};
  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    box-shadow: ${(props) => props.theme.shadows.md};
  }
`;

export const CardHeader = styled.div`
  font-size: ${(props) => props.theme.fontSizes.lg};
  font-weight: bold;
  margin-bottom: ${(props) => props.theme.spacing.base};
  color: ${(props) => props.theme.colors.primary};
`;

export const CardContent = styled.div`
  font-size: ${(props) => props.theme.fontSizes.base};
  color: ${(props) => props.theme.colors.text};
`;

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return <CardWrapper className={className}>{children}</CardWrapper>;
};

export const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <CardHeader>{children}</CardHeader>;
};