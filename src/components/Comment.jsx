import React, { useState, useContext, Fragment } from "react";

import { UserContext } from "../app";
import { postData, deleteData } from "../pages/apiUtil";

import "../pages/pages.css";

const Comment = ({ commentObj, fetchArticle }) => {
    const { id, articleId, authorId, authorName, postTimeStamp } = commentObj;

    const [isEditing, setEditing] = useState(false);
    const [content, setContent] = useState(commentObj.content);
    const { user } = useContext(UserContext);

    const handleDeleteClick = async () => {
        const response = await deleteData("comment/delete", {
            articleId: articleId,
            commentId: id
        });
        if (response && response.status === "OK") {
            setContent("");
            fetchArticle();
        }
    };

    const handleEditClick = () => setEditing(true);

    const handleFinishClick = async (event) => {
        const response = await postData("comment/edit", {
            commentId: id,
            content: content
        });
        if (response && response.status === "OK") setEditing(false);
    };

    const handleChange = (event) => setContent(event.target.value);

    const renderCommentHeader = (
        <h4>
            {authorName} 發表於 {new Date(postTimeStamp).toLocaleString("en-US", { hour12: true })}
            {user.id === authorId && (
                <button onClick={handleEditClick}>
                    <i className="fas fa-edit"></i>
                </button>
            )}
            {user.id === authorId && (
                <button onClick={handleDeleteClick}>
                    <i className="fas fa-times-circle"></i>
                </button>
            )}
        </h4>
    );

    const renderCommentContent = isEditing ? (
        <Fragment>
            <textarea onChange={handleChange} value={content}></textarea>
            <button onClick={handleFinishClick}>Done</button>
        </Fragment>
    ) : (
        <p>{content}</p>
    );

    return (
        <Fragment>
            {renderCommentHeader}
            {renderCommentContent}
        </Fragment>
    );
};

export default Comment;
