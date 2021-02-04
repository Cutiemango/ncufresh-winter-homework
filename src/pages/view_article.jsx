import React, { useState, useEffect, useContext, useCallback, Fragment } from "react";

import { getData, postData } from "../util/apiUtil";

import { LoginStatus, UserContext } from "../app";
import Comment from "../components/Comment";

import "./pages.scss";

const ViewArticlePage = (props) => {
    const articleId = props.match.params.id;

    const { user } = useContext(UserContext);
    const { isLoggedIn, fetchSession } = useContext(LoginStatus);

    const [article, setArticle] = useState({
        authorName: "",
        content: "",
        comments: [],
        postTimeStamp: Date.now()
    });
    const [newComment, setNewComment] = useState("");
    const [isEditing, setEditing] = useState(false);

    const fetchArticle = useCallback(async () => {
        const response = await getData("article/query", {
            articleId: articleId
        });
        if (response && response.status === "OK") setArticle(response.article);
    }, [articleId]);

    useEffect(() => fetchArticle(), [fetchArticle]);

    const handleCommentChange = (event) => setNewComment(event.target.value);
    const handleArticleChange = (event) =>
        setArticle((prev) => {
            return {
                ...prev,
                content: event.target.value
            };
        });

    const handleEditClick = () => setEditing(true);

    const handleCreateClick = async () => {
        fetchSession();

        if (!isLoggedIn) {
            alert("The login session has expired. Please re-login!");
            return;
        }
        const response = await postData("comment/create", {
            articleId: articleId,
            content: newComment,
            timeStamp: Date.now()
        });
        if (response && response.status === "OK") {
            setNewComment("");
            fetchArticle();
        }
    };

    const handleFinishClick = async () => {
        const response = await postData("article/edit", {
            articleId: articleId,
            content: article.content
        });
        if (response && response.status === "OK") {
            setEditing(false);
            fetchArticle();
        }
    };

    const renderComments = article.comments.map((comment, id) => {
        return <Comment key={id} commentObj={comment} fetchArticle={fetchArticle} />;
    });

    const renderArticleHeader = (
        <h4>
            {article.authorName} 發表於{" "}
            {new Date(article.postTimeStamp).toLocaleString("en-US", { hour12: true })}
            {user.id === article.authorId && (
                <button onClick={handleEditClick}>
                    <i className="fas fa-edit"></i>
                </button>
            )}
        </h4>
    );

    const renderArticleContent = isEditing ? (
        <Fragment>
            <textarea onChange={handleArticleChange} value={article.content}></textarea>
            <button onClick={handleFinishClick}>Done</button>
        </Fragment>
    ) : (
        <p>{article.content}</p>
    );

    const renderNewCommentArea = isLoggedIn ? (
        <Fragment>
            <textarea
                id="create_comment"
                onChange={handleCommentChange}
                value={newComment}
            ></textarea>
            <button id="create_comment_btn" onClick={handleCreateClick}>
                Submit
            </button>
        </Fragment>
    ) : (
        <h4>請先登入！</h4>
    );

    return (
        <Fragment>
            {renderArticleHeader}
            {renderArticleContent}
            <h4>留言</h4>
            {renderComments}
            <h4>新增回覆：</h4>
            {renderNewCommentArea}
        </Fragment>
    );
};

export default ViewArticlePage;
