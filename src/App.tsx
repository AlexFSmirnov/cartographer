import { createTheme, useTheme } from '@mui/material';
import { BottomMenu } from './components';
import { AppContainer } from './style';

const App = () => {
    const theme = useTheme();
    console.log(theme);

    return (
        <AppContainer>
            <h1>Hello World</h1>
            <BottomMenu />
        </AppContainer>
    );
};

export default App;
