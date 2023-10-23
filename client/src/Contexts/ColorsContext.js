import { createContext } from "react";

const Colors = {
    Blue: "#89B0AE",
    Pink: "#E7A7A9",
    Green: "#A5D6A7",
    Lavender: "#BFA3B0"
}

const ColorsContext = createContext(Colors);

const exportColors = {Colors, ColorsContext};

export default exportColors;