import { useEffect } from "react";

const NotFound = () => {
    useEffect(() => {
        document.title = "Not Found - eVenting"
    })
    return (
        <div>
            <h1>404 Not Found</h1>
        </div>
    )
}

export default NotFound;