import { StatusBar } from "react-native";
import { useTheme } from "@context/ThemeProvider"

const CustomStatusBar = () => {
    const { theme } = useTheme() as any

    const statusBarStyle = theme.themeMode === "default" ? "dark-content" : "light-content"

    return (
        <StatusBar
            backgroundColor={theme.backgroundColor}
            barStyle={statusBarStyle}
        />
    )
}

export default CustomStatusBar