import { useContext, useState } from "react";
import { ColorsContext } from "../../Contexts";
import "./CreatePost.css"
import AUTH from "../../utils/auth";

const CreatePost = () => {
    const [postText, setPostText] = useState("");
    const [postImages, setPostImages] = useState<string[]>([]);
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const Colors = useContext(ColorsContext);

    const changeTextBox = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        switch (e.target.id) {
            case "postText":
                if (postText.length >= 500 && e.target.value.length > postText.length) return;
                setPostText(e.target.value);
                break;
        }
    }

    const post = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (postText === "") {
            setTimeout(() => setErrorVisible(false), 2500);
            setErrorMessage("Please fill the text box");
            return setErrorVisible(true);
        }
        const body = {postText: postText, postImages: postImages};
        
        const response = await fetch("/api/posts/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": "BEARER " + AUTH.getToken()
        },
            body: JSON.stringify(body)
        })

        const data = await response.json();

        if (data.errorMessage) {
            setTimeout(() => setErrorVisible(false), 2500);
            setErrorMessage(data.errorMessage);
            return setErrorVisible(true);
        }

        window.location.assign("/user/me");

    }

    const handleChangeImage = async () => {
        if (postImages.length >= 4) {
            setTimeout(() => setErrorVisible(false), 2500);
            setErrorVisible(true);
            setErrorMessage("Only up to 4 images allowed on a post");
        }
        const file = await window.showOpenFilePicker({types: [{description: "Images", accept: {"image/*": [".png", ".jpg", ".jpeg"]}}], multiple: false, excludeAcceptAllOption: true});
        if (!file[0]) return;
        const fileContents = await file[0].getFile();
        if (!fileContents) return;
        const reader = new FileReader();
        reader.readAsDataURL(fileContents);
        reader.onload = async () => {
            console.log(reader.result)
            setPostImages([...postImages, reader.result as string]);
        }
    }

    return (
        <div className="CreatePost">
            <h1>Create Post</h1>
            <div className="postForm">
                <form onSubmit={post}>
                    <div>
                        <label>{postText.length}/500</label>
                        <textarea className="postInput" id="postText" onChange={changeTextBox} value={postText}></textarea><br />
                    </div>
                    {postImages.map((image, index) => (
                        <div className="postImageContainer" key={index} style={{width: postImages.length > 1 ? "45%" : "90%", marginLeft: "2.5%", display: "inline-block"}}>
                            <button className="removeImageButton HoverPointer" onClick={() => setPostImages(postImages.filter((_, i) => i !== index))} style={{backgroundColor: Colors.Green}}>Remove</button>
                            <img className="postImage" id={`postImage${index}`} src={image}></img>
                        </ div>
                    ))}<br />
                    <button className="addImageButton HoverPointer" onClick={() => postImages.length >= 4 ? null : handleChangeImage()} style={{backgroundColor: postImages.length >= 4 ? Colors.Blue : Colors.Green}}>Add Image</button><br />
                    <p className="errorMessage" style={{color: Colors.Pink, fontSize: "20px", visibility: errorVisible ? "visible" : "hidden"}}>{errorMessage}</p>
                    <button className="postButton HoverPointer" style={{backgroundColor: Colors.Green}}>Post</button>
                </form>
            </div>
        </div>
    )
}

export default CreatePost;