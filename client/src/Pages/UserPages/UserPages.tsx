import { useContext, useEffect, useState } from "react";
import AUTH from "../../utils/auth";
import "./UserPages.css"
import FollowedEventsTab from "../../Components/FollowedEventsTab/FollowedEventsTab";
import CreatedEventsTab from "../../Components/CreatedEventsTab/CreatedEventsTab";
import { ColorsContext } from "../../Contexts";
import Profile from "../../Components/Profile/Profile";

const UserTabs = [
    "Feed",
    "Posts",
    "Followed Events",
    "Created Events",
    "Comments"
]

interface UserPagesProps {
    tooSmall: boolean;
}

const UserPages = ({tooSmall}: UserPagesProps) => {
    const Color = useContext(ColorsContext);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentTab, setCurrentTab] = useState<string>(UserTabs[0]);
    const visitor = document.URL.split("/")[document.URL.split("/").length - 1] === "me" ? false : true;

    // const [loadingText, setLoadingText] = useState<string>("Loading...")
    useEffect(() => {
        const fetchData = async () => {
            let id = document.URL.split("/")[document.URL.split("/").length - 1];
            if (id === "me") {
                if (AUTH.isTokenExpired()) AUTH.refreshToken();
                id = (AUTH as AuthServiceType).getProfile().data._id;
            }
            const response = await fetch(`/api/profiles/${id}`, {method: "GET"});
            const data = await response.json();
            console.log(data);
            if (data.errorMessage && data.errorCode !== 404) {
                alert(data.errorMessage);
                return window.location.assign("/");
            }
            setProfileData(data);
            setLoading(false);
        }
        fetchData();
    }, [])

    useEffect (() => {
        if (profileData?.username) document.title = `${profileData.username} - eVenting`;
    }, [profileData])

    
    
    const getCurrentTab = () => {
        switch (currentTab) {
            case "Feed":
                return <></>
            case "Posts":
                return <></>
            case "Followed Events":
                return <FollowedEventsTab></ FollowedEventsTab>
            case "Created Events":
                return <CreatedEventsTab></CreatedEventsTab>
            case "Comments":
                return <></>
            default:
                return <></>
        }
    }
    return (
        loading ? <h1>Loading...</h1> : (
            <div>
                <Profile profileData={profileData as ProfileData} visitor={visitor} tooSmall={tooSmall}></Profile>
                <div className="tabContainer" style={{backgroundColor: Color.Green}}>
                    {UserTabs.map((tab, i) => (
                        <div className="tab HoverPointer" key={i}>
                            <h3 onClick={() => setCurrentTab(tab)}>{tab}</h3>
                        </div>
                    )
                    )}
                </div>
                <h2>{currentTab}</h2>
                {getCurrentTab()}
            </div>
        )
    )
}

export default UserPages;