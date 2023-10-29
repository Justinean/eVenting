import "./Profile.css";
import AUTH from "../../utils/auth";
import { useEffect, useState } from "react";

interface ProfileProps {
    profileData: ProfileData;
    visitor: boolean;
    tooSmall: boolean;
}

const Profile = ({profileData, visitor, tooSmall}: ProfileProps) => {
    const [editing, setEditing] = useState<boolean>(false);
    const [editUsernameValue, setEditUsernameValue] = useState<string>("");
    const [editBioValue, setEditBioValue] = useState<string>("");
    const [editProfilePicture, setEditProfilePicture] = useState<string>("");

    const SaveEdits = async () => {
        if (editUsernameValue.length < 3) return window.alert("Username must be at least 3 characters long");
        if (editBioValue.length > 512) return window.alert("Bio must be less than 512 characters long");
        const body = {username: editUsernameValue, bio: editBioValue, profilePicture: editProfilePicture};
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
        setEditProfilePicture(profileData?.profilePicture || "");
    }, [profileData])

    const handleChangeImage = async () => {
        const file = await window.showOpenFilePicker({types: [{description: "Images", accept: {"image/*": [".png", ".jpg", ".jpeg"]}}], multiple: false, excludeAcceptAllOption: true});
        const fileContents = await file[0].getFile();
        const reader = new FileReader();
        reader.readAsDataURL(fileContents);
        reader.onload = async () => {
            console.log(reader.result)
            setEditProfilePicture(reader.result as string);
        }
    }

    return editing ? (
                    <div className="Profile">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <img className="HoverPointer" src={editProfilePicture.length === 0 ? "https://placehold.co/250" : editProfilePicture} alt="Profile Picture" style={{width: "75px", height: "75px", borderRadius: "50%", border: "2px solid black", marginLeft: tooSmall ? "0" : "5%", backgroundColor: "white"}} onClick={handleChangeImage}></img>
                        <div style={{ display: "flex", flexWrap: "wrap", height: "50%", width: `fit-content`, alignItems: "center", marginLeft: "10px"}}>
                            <input style={{display: "inline-block", width: `100%`, fontSize: "1.5em", fontWeight: "bold"}} value={editUsernameValue} onChange={e => editUsernameValue.length < 10 || e.target.value.length < editUsernameValue.length ? setEditUsernameValue(e.target.value) : window.alert("Character Limit is 10")}></input>
                            <h3 style={{display: "inline-block", margin: 0}}>#{profileData?.id}</h3>
                        </ div>
                        <h4 className="HoverPointer" style={{display: "inline", marginLeft: "10px"}} onClick={() => {setEditing(false); SaveEdits()}}> Save</h4>
                        <h4 className="HoverPointer" style={{display: "inline", marginLeft: "20px"}} onClick={() => {setEditing(false); setEditUsernameValue((profileData as ProfileData).username)}}> Cancel</h4>
                    </div>
                    <textarea style={{display: "block", width: `${.33 * window.innerWidth}px`, minHeight: "100px", height: "100px", marginLeft: tooSmall ? "20%" : "25%", marginBottom: "1.5em"}} value={editBioValue} onChange={e => editBioValue.length < 512 || e.target.value.length < editBioValue.length ? setEditBioValue(e.target.value) : window.alert("Character Limit is 512")}></textarea>
                    <h3 style={{display: "inline-block"}}>Following: {profileData?.following?.length || 0}</h3>
                    <h3 style={{display: "inline-block", marginLeft: "10px"}}>Followers: {profileData?.followers?.length || 0}</h3>
                    </div>
        ) : (
                <div className="Profile">
                    {/* todo: add edit profile picture and picture storage */}
                <div style={{display: "flex", alignItems: "center", width: "fit-content"}}>
                    <img src={profileData?.profilePicture != null ? profileData?.profilePicture : "https://placehold.co/250"} alt="Profile Picture" style={{width: "75px", height: "75px", borderRadius: "50%", marginLeft: tooSmall ? "0" : "5%"}}></img>
                    <div style={{ display: "flex", flexDirection: "column", height: "50%", width: "100%", justifyContent: "center", marginLeft: "10px"}}>
                        <h2 style={{margin: 0}}>{profileData?.username}</h2>
                        <h3 style={{margin: 0}}>#{profileData?.id}</h3>
                    </ div>
                    {!visitor ? <h4 className="HoverPointer" style={{display: "inline", whiteSpace: "nowrap", marginLeft: "10px"}} onClick={() => setEditing(true)}> Edit Profile</h4> : <></>}
                </div>
                <h3 style={{marginLeft: tooSmall ? "0%" : "5%", minHeight: "50px"}}>{profileData?.bio}</h3>
                <h3 style={{display: "inline-block"}}>Following: {profileData?.following?.length || 0}</h3>
                <h3 style={{display: "inline-block", marginLeft: "10px"}}>Followers: {profileData?.followers?.length || 0}</h3>
                </div>
        )
}

export default Profile;