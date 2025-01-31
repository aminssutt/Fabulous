import React from 'react';
import styled from 'styled-components';

const BackgroundWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  overflow: hidden;
`;

const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    ${props => props.theme.colors.primary}22,
    ${props => props.theme.colors.secondary}22
  );
`;

const Pattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(${props => props.theme.colors.primary}11 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.5;
`;

const Background = () => {
  return (
    <BackgroundWrapper>
      <GradientOverlay />
      <Pattern />
    </BackgroundWrapper>
  );
};

export default Background; 