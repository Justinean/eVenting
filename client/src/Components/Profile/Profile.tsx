import "./Profile.css";
import AUTH from "../../utils/auth";
import { useEffect, useState, useContext } from "react";
import { ColorsContext } from "../../Contexts";
import { readFile } from "../../utils/fileReader";

interface ProfileProps {
    profileData: ProfileData;
    visitor: boolean;
    tooSmall: boolean;
    setProfileData: React.Dispatch<React.SetStateAction<ProfileData | null>>;
}

const Profile = ({profileData, visitor, tooSmall, setProfileData}: ProfileProps) => {
    const Colors = useContext(ColorsContext);
    const [editing, setEditing] = useState<boolean>(false);
    const [editUsernameValue, setEditUsernameValue] = useState<string>("");
    const [editBioValue, setEditBioValue] = useState<string>("");
    const [editProfilePicture, setEditProfilePicture] = useState<string | null>(null);
    const [displayImage, setDisplayImage] = useState<string>("https://placehold.co/250.png");
    const [following, setFollowing] = useState<boolean>(false);

    const SaveEdits = async () => {
        if (editUsernameValue.length < 3) return window.alert("Username must be at least 3 characters long");
        if (editBioValue.length > 512) return window.alert("Bio must be less than 512 characters long");
        const body = {username: editUsernameValue, bio: editBioValue, profilePicture: editProfilePicture};
        if (AUTH.isTokenExpired() && AUTH.loggedIn()) AUTH.refreshToken();
        const response = await fetch("/api/profiles/edit", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "authorization": "BEARER " + AUTH.getToken(),
            },
            body: JSON.stringify(body)
        })
        const data = await response.json();
        if (data.errorMessage) return window.alert(data.errorMessage);
        window.location.reload();
    }

    useEffect(() => {
        setEditUsernameValue(profileData?.username || "");
        setEditBioValue(profileData?.bio || "");
        setFollowing(false)
        setDisplayImage(profileData?.profilePicture || "");
        if (!AUTH.loggedIn()) return;
        setFollowing(profileData?.followers?.includes((AUTH as AuthServiceType)?.getProfile()?.data._id) || false);
    }, [profileData])

    useEffect(() => {
        setEditProfilePicture(displayImage);
    }, [displayImage])

    const handleChangeImage = async () => {
        const file = await window.showOpenFilePicker({types: [{description: "Images", accept: {"image/*": [".png", ".jpg", ".jpeg"]}}], multiple: false, excludeAcceptAllOption: true});
        const fileContents = await file[0].getFile();
        const readableLink = await readFileHandler(fileContents)
        setEditProfilePicture(readableLink);
    }

    const follow = async () => {
        if (!AUTH.loggedIn()) return promptLogin();
        if (AUTH.isTokenExpired() && AUTH.loggedIn()) await AUTH.refreshToken();
        const response = await fetch(`/api/profile/${following ? "unfollow" : "follow"}/${profileData?._id}`, {
            method: "PUT",
            headers: {
                "authorization": "BEARER " + AUTH.getToken(),
            }
        })
        const data = await response.json();
        if (data.errorMessage) return window.alert(data.errorMessage);
        setProfileData(data);
    }

    const promptLogin = () => {

    }

    const readFileHandler = async (file: File) => {
        const readfile = await readFile(file)
        if (!readfile) return "https://placehold.co/250";
        setDisplayImage(readfile);
        return readfile;
    }


    return editing ? (
                    <div className="Profile" style={{backgroundColor: Colors.DarkGreen, color: Colors.Lavender}}>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <img className="HoverPointer" src={editProfilePicture === null ? "https://placehold.co/250" : editProfilePicture} alt="Profile Picture" style={{width: "75px", height: "75px", borderRadius: "50%", border: "5px solid black", marginLeft: tooSmall ? "0" : "5%", backgroundColor: "white"}} onClick={handleChangeImage}></img>
                        <div style={{ display: "flex", flexWrap: "wrap", height: "50%", width: `fit-content`, alignItems: "center", marginLeft: "10px"}}>
                            <input style={{display: "inline-block", width: `100%`, fontSize: "1.5em", fontWeight: "bold"}} value={editUsernameValue} onChange={e => editUsernameValue.length < 10 || e.target.value.length < editUsernameValue.length ? setEditUsernameValue(e.target.value) : window.alert("Character Limit is 10")}></input>
                            <h3 style={{display: "inline-block", margin: 0}}>#{profileData?.id}</h3>
                        </ div>
                        {!tooSmall ? (<>
                            <h4 className="HoverPointer" style={{display: "inline", marginLeft: "10px"}} onClick={() => {setEditing(false); SaveEdits()}}> Save</h4>
                            <h4 className="HoverPointer" style={{display: "inline", marginLeft: "20px", marginRight: "30px"}} onClick={() => {setEditing(false); setEditUsernameValue((profileData as ProfileData).username)}}> Cancel</h4>
                        </>) : <></>}
                    </div>
                    <textarea style={{display: "block", width: `80%`, minHeight: "100px", height: "100px", marginLeft: tooSmall ? "10%" : "10%", marginBottom: "1em", marginTop: "15px"}} value={editBioValue} onChange={e => editBioValue.length < 512 || e.target.value.length < editBioValue.length ? setEditBioValue(e.target.value) : window.alert("Character Limit is 512")}></textarea>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <div>
                            <h3 style={{display: "inline-block", marginLeft: "30px"}}>Following: {profileData?.following?.length || 0}</h3>
                            <h3 style={{display: "inline-block", marginLeft: "10px"}}>Followers: {profileData?.followers?.length || 0}</h3>
                        </div>
                        {tooSmall ? (<div>
                            <h4 className="HoverPointer" style={{display: "inline", marginLeft: "10px"}} onClick={() => {setEditing(false); SaveEdits()}}> Save</h4>
                            <h4 className="HoverPointer" style={{display: "inline", marginLeft: "20px", marginRight: "30px"}} onClick={() => {setEditing(false); setEditUsernameValue((profileData as ProfileData).username)}}> Cancel</h4>
                        </div>) : <></>}
                    </div>
                    </div>
        ) : (
                <div className="Profile" style={{backgroundColor: Colors.Green}}>
                    {/* todo: add edit profile picture and picture storage */}
                <div style={{display: "flex", justifyContent: visitor ? "space-between" : "flex-start", width: visitor ? "100%" : "75%"}}>
                    <div style={{display: "flex", alignItems: "center"}}>
                        {profileData?.profilePicture != null ? <img src={(displayImage as string)} alt="Profile Picture" style={{width: "75px", height: "75px", borderRadius: "50%", border: "5px solid black", marginLeft: tooSmall ? "0" : "5%"}}></img> : <></>}
                        <div style={{ display: "flex", flexDirection: "column", height: "50%", width: "100%", justifyContent: "center", marginLeft: "10px"}}>
                            <h2 style={{margin: 0}}>{profileData?.username}</h2>
                            <h3 style={{margin: 0}}>#{profileData?.id}</h3>
                        </ div>
                    </div>
                    {AUTH.loggedIn() ? !visitor ? <h4 className="HoverPointer" style={{display: "inline", whiteSpace: "nowrap", marginLeft: "20px"}} onClick={() => setEditing(true)}> Edit Profile</h4> : (
                    <div>
                        <h4 className="HoverPointer" style={{display: "inline", whiteSpace: "nowrap", marginLeft: "10px"}} onClick={() => window.location.assign("/")}>Message</h4>
                        <h4 className="HoverPointer" style={{display: "inline", whiteSpace: "nowrap", marginLeft: "10px", marginRight: "15px"}} onClick={follow}>{following ? "Unfollow" : "Follow"}</h4>
                    </div>) : <></>}
                </div>
                <h3 style={{marginLeft: tooSmall ? "0%" : "5%", minHeight: "50px"}}>{profileData?.bio}</h3>
                <h3 style={{display: "inline-block", marginLeft: "10px"}}>Following: {profileData?.following?.length || 0}</h3>
                <h3 style={{display: "inline-block", marginLeft: "10px"}}>Followers: {profileData?.followers?.length || 0}</h3>
                </div>
        )
}

export default Profile;