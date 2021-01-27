import React, { useState, Fragment } from "react";
import { Redirect } from "react-router-dom";

import { postData } from "./apiUtil";

import "./pages.css";

const CreateArticlePage = () => {
    const [content, setContent] = useState("");
    const [hasSubmitted, setSubmitted] = useState(false);

    const handleChange = (event) => {
        setContent(event.target.value);
    };

    const handleClick = async () => {
        const response = await postData("article/create", {
            content: content,
            timeStamp: Date.now()
        });
        if (response && response.status === "OK") setSubmitted(true);
    };

    return hasSubmitted ? (
        <Redirect to="/articles"></Redirect>
    ) : (
        <Fragment>
            <textarea
                id="create_article_textarea"
                rows="10"
                cols="50"
                onChange={handleChange}
            ></textarea>
            <button id="create_article_submit" onClick={handleClick}>
                Create
            </button>
        </Fragment>
    );
};

export default CreateArticlePage;
