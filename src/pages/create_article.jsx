import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";

import BlockButton from "../components/BlockButton";
import { LoginStatus } from "../app";
import { postData } from "../util/apiUtil";

import "./create_article.scss";

const CreateArticlePage = () => {
    const { isLoggedIn, fetchSession } = useContext(LoginStatus);

    const [content, setContent] = useState("");
    const [hasSubmitted, setSubmitted] = useState(false);

    const handleChange = (event) => {
        setContent(event.target.value);
    };

    const handleClick = async () => {
        fetchSession();
        if (!isLoggedIn) {
            alert("The login session has expired. Please re-login.");
            return;
        }

        const response = await postData("article/create", {
            content: content,
            timeStamp: Date.now()
        });
        if (response && response.status === "OK") setSubmitted(true);
    };

    return hasSubmitted ? (
        <Redirect to="/articles"></Redirect>
    ) : (
        <div className="create_article">
            <h2>Create New Article</h2>
            <textarea
                id="create_article_textarea"
                rows="10"
                cols="50"
                onChange={handleChange}
            ></textarea>
            <br></br>
            <BlockButton onClick={handleClick}>Create</BlockButton>
        </div>
    );
};

export default CreateArticlePage;
