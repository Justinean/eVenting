import { createContext } from "react";

const Colors = {
    Blue: "#89B0AE",
    Pink: "#E7A7A9",
    Green: "#A5D6A7",
    Lavender: "#BFA3B0",

    DarkBlue: "#3E5B59",
    DarkPink: "#D16368",
    DarkGreen: "#4E7E4F",
    DarkLavender: "#755771",
};

const ColorsContext = createContext(Colors);

// const exportColorContexts = {Colors, ColorsContext};

export {Colors, ColorsContext};