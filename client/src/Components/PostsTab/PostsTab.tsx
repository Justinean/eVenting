import "./PostsTab.css";

const PostsTab = () => {
    return (
        <div className="PostsTab">
            <div className="PostsTabHeader">
                <h1>Posts</h1>
                <h3 className="HoverPointer" onClick={() => window.location.assign("/post/create")}>Create Post</h3>
            </div>
        </div>
    )
}

export default PostsTab;