import React, { useState, useEffect, Fragment } from "react";

import { getData } from "../util/apiUtil";

import "./pages.css";

const Home = () => {
    const [latestArticle, setLatestArticle] = useState({
        authorName: "",
        content: "",
        comments: [],
        postTimeStamp: Date.now()
    });

    const fetchLatest = async () => {
        const response = await getData("article/query_latest");
        if (response && response.status === "OK") setLatestArticle(response.article);
    };

    useEffect(() => fetchLatest(), []);

    return (
        <Fragment>
            <h2>最新文章</h2>
            <p>
                {latestArticle.authorName} 發表於{" "}
                {new Date(latestArticle.postTimeStamp).toLocaleString("en-US", { hour12: true })}
            </p>
            <p>{latestArticle.content}</p>
        </Fragment>
    );
};

export default Home;
