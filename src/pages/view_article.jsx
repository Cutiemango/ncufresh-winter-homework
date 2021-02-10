import React, { useState, useEffect, useContext, useCallback } from "react";

import { getData, postData } from "../util/apiUtil";

import { LoginStatus, UserContext } from "../app";
import Comment from "../components/Comment";
import BlockButton from "../components/BlockButton";

import "./view_article.scss";

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

    const renderNewCommentArea = isLoggedIn ? (
        <div className="create_comment">
            <textarea onChange={handleCommentChange} value={newComment}></textarea>

            <BlockButton onClick={handleCreateClick}>Create New Comment</BlockButton>
        </div>
    ) : (
        <h4>登入後才能留言哦！</h4>
    );

    const renderArticle = (
        <div className="content_wrapper">
            <div className="content_header">
                <h2>{article.authorName}</h2>
                <h3>{article.authorId}</h3>
                <h3>
                    發表於
                    {" " +
                        new Date(article.postTimeStamp).toLocaleString("en-US", { hour12: true })}
                </h3>
            </div>
            <div className="content">
                {isEditing ? (
                    <textarea onChange={handleArticleChange} value={article.content}></textarea>
                ) : (
                    <p>{article.content}</p>
                )}
            </div>
            <div className="content_actions">
                {user.id === article.authorId && !isEditing && (
                    <button className="btn" onClick={handleEditClick}>
                        <i className="fas fa-edit"></i>
                    </button>
                )}

                {isEditing && (
                    <button className="btn" onClick={handleFinishClick}>
                        <i className="fas fa-check-square"></i>
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="article_page">
            {renderArticle}
            <div className="bar"></div>
            {renderComments}
            <div className="bar"></div>
            {renderNewCommentArea}
        </div>
    );
};

export default ViewArticlePage;
