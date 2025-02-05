import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    font-family: ${props => props.theme.fonts.secondary};
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${props => props.theme.fonts.primary};
    margin-bottom: 1rem;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    cursor: pointer;
  }

  img {
    max-width: 100%;
    height: auto;
  }
`;
