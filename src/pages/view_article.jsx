import React, { useState, useEffect, useContext, useCallback, Fragment } from "react";

import { getData, postData } from "./apiUtil";

import { UserContext } from "../app";
import Comment from "../components/Comment";

import "./pages.css";

const ViewArticlePage = (props) => {
    const articleId = props.match.params.id;

    const { user } = useContext(UserContext);

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

    useEffect(() => fetchArticle(), [articleId, fetchArticle]);

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

    return (
        <Fragment>
            {renderArticleHeader}
            {renderArticleContent}
            <h4>留言</h4>
            {renderComments}
            <h4>新增回覆：</h4>
            <textarea
                id="create_comment"
                onChange={handleCommentChange}
                value={newComment}
            ></textarea>
            <button id="create_comment_btn" onClick={handleCreateClick}>
                Submit
            </button>
        </Fragment>
    );
};

export default ViewArticlePage;
