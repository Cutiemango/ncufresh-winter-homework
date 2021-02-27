import React, { useState, useContext } from "react";

import { UserContext } from "../app";
import { postData, deleteData } from "../util/apiUtil";

import "../pages/pages.scss";

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
        if (response?.status === "OK") {
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
        if (response?.status === "OK") setEditing(false);
    };

    const handleChange = (event) => setContent(event.target.value);

    return (
        <div className="content_wrapper">
            <div className="content_header">
                <h2>{authorName}</h2>
                <h3>{authorId}</h3>
                <h3>
                    發表於
                    {" " + new Date(postTimeStamp).toLocaleString("en-US", { hour12: true })}
                </h3>
            </div>
            <div className="content">
                {isEditing ? (
                    <textarea onChange={handleChange} value={content}></textarea>
                ) : (
                    <p>{content}</p>
                )}
            </div>
            <div className="content_actions">
                {user.id === authorId && !isEditing && (
                    <button className="btn" onClick={handleEditClick}>
                        <i className="fas fa-edit"></i>
                    </button>
                )}

                {isEditing && (
                    <button className="btn" onClick={handleFinishClick}>
                        <i className="fas fa-check-square"></i>
                    </button>
                )}

                {(user.id === authorId || user.isAdmin) && (
                    <button id="remove_btn" className="btn" onClick={handleDeleteClick}>
                        <i className="fas fa-times-circle"></i>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Comment;
