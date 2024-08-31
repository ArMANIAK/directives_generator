"use server"

import MainScreen from "@/components/MainScreen";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});
export default async function Home() {

  return (
          <MainScreen />
  );
}
