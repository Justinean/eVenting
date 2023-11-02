import { useEffect, useState, useRef, useContext } from "react";
import "./PostsTab.css";
import AUTH from "../../utils/auth";
import { ColorsContext } from "../../Contexts";

interface PostsTabProps {
    profileData: ProfileData;
    visitor: boolean;
}

const PostsTab = ({profileData, visitor}: PostsTabProps) => {
    const [viewComments, setViewComments] = useState([false]);
    const [displayPostNewCommentTexts, setDisplayPostNewCommentTexts] = useState<string[]>([]);
    const [posts, setPosts] = useState<PostType[] | null>(null);
    const [errorMessage, setErrorMessage] = useState("A");
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const displayPostNewCommentRefs = useRef<HTMLTextAreaElement[]>([])
    const Colors = useContext(ColorsContext);

    const changeTextBox = (e: React.ChangeEvent<HTMLTextAreaElement>, i: number) => {
            console.log(displayPostNewCommentRefs);
            if (e.target.value.length > 100) return;
            setDisplayPostNewCommentTexts([...displayPostNewCommentTexts.map((item, j) => i != j ? item : e.target.value)]);
    }

    useEffect(() => {
        const fetchData = async () => {
            if (AUTH.isTokenExpired() && AUTH.loggedIn()) await AUTH.refreshToken();
            const response = await fetch(`/api/profiles/posts/${profileData._id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": "BEARER " + AUTH.getToken(),
                }
            })
            const data = await response.json();
            if (data.errorMessage) return window.alert(data.errorMessage);
            setPosts(data);
        }
        fetchData();
    }, [profileData])

    useEffect(() => {
        if (posts == null) return;
        console.log();
        setDisplayPostNewCommentTexts(posts.map(() => ""));
        setViewComments(posts.map(() => false));
    }, [posts])

    useEffect(() => {
        console.log(AUTH.getProfile())
    }, [viewComments])

    const comment = async (i: number) => {
        if (displayPostNewCommentTexts[i].length == 0) {
            setErrorMessage("Comment cannot be empty");
            setShowErrorMessage(true);
            return setTimeout(() => setShowErrorMessage(false), 2000);
        }
        const body = {text: displayPostNewCommentTexts[i]};
        if (AUTH.isTokenExpired() && AUTH.loggedIn()) await AUTH.refreshToken();
        const response = await fetch(`/api/posts/comment/${posts?.[i]?._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "authorization": "BEARER " + AUTH.getToken(),
            },
            body: JSON.stringify(body)
        })
        const data = await response.json();
        if (data.errorMessage) return window.alert(data.errorMessage);
        setPosts(posts?.map((item, j) => i != j ? item : data) as PostType[]);
    }

    const likePost = async (type: string, like: boolean, i: number) => {
        if (AUTH.isTokenExpired() && AUTH.loggedIn()) await AUTH.refreshToken();
        const response = await fetch(`/api/${type === "post" ? "posts" : "comments"}/${like ? "like" : "unlike"}/${type === "post" ? posts?.[i]?._id : posts?.[i].comments}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "authorization": "BEARER " + AUTH.getToken(),
            }
        })
        const data = await response.json();
        if (data.errorMessage) return window.alert(data.errorMessage);
        setPosts(posts?.map((item, j) => i != j ? item : data) as PostType[]);
    }

    return !visitor ? (
        <div className="PostsTab">
            <div className="PostsTabHeader">
                <h1>Posts</h1>
                <h3 className="HoverPointer" onClick={() => window.location.assign("/post/create")}>Create Post</h3>
            </div>
            <div className="Posts">
                {posts?.map((post, i) => (
                    <div className="Post" key={i}>
                        <h3 className="displayPostAuthorUsername" onClick={() => window.location.assign(`/user/${profileData._id}`)}>{profileData.username}</h3>
                        <h3 className="displayPostAuthorId">#{profileData.id}</h3>
                        <p className="displayPostText">{post.text}</p>
                        {post.images.map((image, j) => (
                            <img className="displayPostImage" id={`postImage${j}`} src={image}></img>
                        ))}
                        <div className="displayPostButtons">
                            <button className="displayPostButton HoverPointer" onClick={() => window.location.assign(`/post/${post._id}`)}>View Post</button>
                            <button className="displayPostButton HoverPointer" onClick={() => window.location.assign(`/post/${post._id}/edit`)}>Edit Post</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    ) : (
        <div className="PostsTab">
            <div className="PostsTabHeader">
                <h1>Posts</h1>
                <h3 className="HoverPointer" onClick={() => window.location.assign("/post/create")}>Create Post</h3>
            </div>
            <div className="Posts">
                {posts?.map((post, i) => (
                    <div className="Post" key={i}>
                        <h3 className="displayPostAuthorUsername" onClick={() => window.location.assign(`/user/${profileData._id}`)}>{profileData.username}</h3>
                        <h3 className="displayPostAuthorId">#{profileData.id}</h3>
                        <p className="displayPostText">{post.text}</p>
                        {post.images.map((image, j) => (
                            <img className="displayPostImage" id={`postImage${j}`} src={image} key={j}></img>
                        ))}
                        <div className="displayPostButtons">
                            <div>
                                <button className="displayPostButton HoverPointer" onClick={() => likePost("post", !post.likes.includes(AUTH.getProfile().data._id), i)}>{post.likes.includes(AUTH.getProfile().data._id) ? "Unlike" : "Like"}</button>
                                <p className="displayPostLikeCount">{post.likes?.length || 0}</p>
                            </div>
                            <div>
                                <button className="displayPostButton HoverPointer" onClick={() => {setViewComments(viewComments.map((item, l) => l == i ? !viewComments[l] : item))}}>Comments</button>
                                <p className="displayPostLikeCount">{post.comments?.length || 0}</p>
                            </div>
                            <div>
                                <button className="displayPostButton HoverPointer" onClick={() => window.location.assign(`/posts/repost/${post._id}`)}>Repost</button>
                                <p className="displayPostLikeCount">{post.reposts?.length || 0}</p>
                            </div>
                        </div>
                        <div className="displayPostComments">
                            {viewComments[i] ? (post.comments?.map((comment, k) => (
                                <div className="displayPostComment" key={k}>
                                    <div className="displayPostCommentAuthor">
                                        <h3 className="displayPostCommentAuthorUsername" onClick={() => window.location.assign(``)}>{comment.author.username}</h3>
                                        <h3 className="displayPostCommentAuthorId">#{comment.author.id}</h3>
                                    </div>
                                    <p className="displayPostCommentText">{comment.text}</p>
                                    <button className="displayPostButton HoverPointer" onClick={() => likePost("post", !post.likes.includes(AUTH.getProfile().data._id), i)}>{comment.likes.includes(AUTH.getProfile().data._id) ? "Unlike" : "Like"}</button>
                                    <p className="displayPostCommentLikeCount">{post.likes?.length || 0}</p>
                                </div>
                            ))) : <></>}
                        </div>
                        {viewComments[i] ? <div className="displayPostNewCommentContainer">
                            <p className="displayPostNewCommentErrorMessage" style={{visibility: showErrorMessage ? "visible" : "hidden", color: Colors.Pink}}>{errorMessage}</p>
                            <textarea className="displayPostNewCommentText" value={displayPostNewCommentTexts[i]} ref={element => {if (element) return displayPostNewCommentRefs.current[i] = element}} onChange={(e) => changeTextBox(e, i)}></textarea>
                            <button className="displayPostNewCommentButton HoverPointer" onClick={() => comment(i)}>Comment</button>
                        </div> : <></>}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PostsTab;