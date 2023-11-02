import { useContext, useEffect, useState } from "react";
import AUTH from "../../utils/auth";
import "./UserPages.css"
import FollowedEventsTab from "../../Components/FollowedEventsTab/FollowedEventsTab";
import CreatedEventsTab from "../../Components/CreatedEventsTab/CreatedEventsTab";
import PostsTab from "../../Components/PostsTab/PostsTab";
import { ColorsContext } from "../../Contexts";
import Profile from "../../Components/Profile/Profile";
import NotFound from "../NotFound/NotFound";

const UserTabs = [
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
    const visitor = document.URL.split("/")[document.URL.split("/").length - 1] === "me" || document.URL.split("/")[document.URL.split("/").length - 1] === AUTH.getProfile().data._id ? false : true;
    // const [loadingText, setLoadingText] = useState<string>("Loading...")
    useEffect(() => {
        const fetchData = async () => {
            let id = document.URL.split("/")[document.URL.split("/").length - 1];
            if (id === "me" || id === AUTH.getProfile().data._id) {
                if (!AUTH.loggedIn()) window.location.assign("/signin");
                if (AUTH.isTokenExpired()) await AUTH.refreshToken();
                id = AUTH.getProfile().data._id;
            }
            const response = await fetch(`/api/profiles/${id}`, {method: "GET"});
            const data = await response.json();
            if (data.errorMessage) {
                console.log(data.errorMessage)
                alert(data.errorMessage);
                return window.location.assign("/");
            }
            console.log(data);
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
            case "Posts":
                return <PostsTab profileData={profileData as ProfileData} visitor={visitor}></PostsTab>
            case "Followed Events":
                return <FollowedEventsTab></ FollowedEventsTab>
            case "Created Events":
                return <CreatedEventsTab></CreatedEventsTab>
            case "Comments":
                return <></>
            default:
                return <NotFound></NotFound>
        }
    }
    return (
        loading ? <h1>Loading...</h1> : (
            <div>
                <Profile profileData={profileData as ProfileData} visitor={visitor} tooSmall={tooSmall} setProfileData={setProfileData}></Profile>
                <div className="tabContainer" style={{backgroundColor: Color.Green}}>
                    {UserTabs.map((tab, i) => (
                        <div className="tab HoverPointer" key={i}>
                            <h3 onClick={() => setCurrentTab(tab)}>{tab}</h3>
                        </div>
                    )
                    )}
                </div>
                {getCurrentTab()}
            </div>
        )
    )
}

export default UserPages;