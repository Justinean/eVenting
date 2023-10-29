import { createContext } from "react";

const SmallStyle = {
    marginLeft: "5%",
}

const SmallStyleContext = createContext(SmallStyle);

export {SmallStyle, SmallStyleContext};