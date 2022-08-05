import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        outline: none;
    }
    html {
        position: relative;
        width: 100vw;
        height: 100vh;
    }
    body {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        -webkit-tap-highlight-color:  rgba(255, 255, 255, 0); 
    }
    #root {
        width: 100%;
        height: 100%;
    }
`;

export const AppContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`;

export const AppContent = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    display: flex;
    flex-direction: column;
`;

export const ViewContainer = styled.div`
    width: 100%;
    flex-grow: 1;
`;
