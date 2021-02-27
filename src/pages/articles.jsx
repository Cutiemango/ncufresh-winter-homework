import React, { useEffect, useState, useContext, useCallback } from "react";
import { Link } from "react-router-dom";

import { UserContext, IppOptionContext } from "../app";
import { getData, deleteData } from "../util/apiUtil";

import "./articles.scss";

const ITEM_OPTIONS = [5, 10, 30];

const ArticlePage = () => {
    const [page, setPage] = useState(1);
    const [articles, setArticles] = useState([]);

    // check the amount of articles in the database and determine if we need to show the next page button
    const [showNextPage, setShowNextPage] = useState(false);

    const { user } = useContext(UserContext);
    const { itemsPerPage, setItemsPerPage } = useContext(IppOptionContext);

    const fetchArticles = useCallback(async () => {
        const articleResponse = await getData("article/query_batch", {
            page: page,
            ipp: itemsPerPage
        });
        if (articleResponse?.status === "OK") setArticles(articleResponse.articles);

        const amountResponse = await getData("article/query_amount");
        if (amountResponse?.status === "OK")
            // there are more articles to show
            setShowNextPage(amountResponse.amount > page * itemsPerPage);
    }, [page, itemsPerPage]);

    useEffect(() => fetchArticles(), [page, itemsPerPage, fetchArticles]);

    const handleDeleteClick = async (articleId) => {
        const response = await deleteData("article/delete", {
            articleId: articleId
        });
        if (response?.status === "OK") fetchArticles();
    };

    const handleLastPageClick = () => setPage((prev) => prev - 1);
    const handleNextPageClick = () => setPage((prev) => prev + 1);
    const handleIppClick = (item) => {
        setItemsPerPage(item);
        setPage(1);
    };

    const renderDeleteButton = (article) => {
        return user.id === article.authorId || user.isAdmin ? (
            <button
                id="remove_btn"
                className="articles_btn"
                onClick={() => handleDeleteClick(article.id)}
            >
                <i className="fas fa-times-circle"></i>
            </button>
        ) : (
            <p> </p>
        );
    };

    const renderArticles = articles.map((article, idx) => {
        return (
            <tr key={idx}>
                <td>{article.authorName}</td>
                <td>{article.content}</td>
                <td>{article.comments.length}</td>
                <td>
                    <Link to={`/view_article/${article.id}`}>
                        <button className="articles_btn">
                            <i className="fas fa-eye"></i>
                        </button>
                    </Link>
                </td>
                <td>{new Date(article.postTimeStamp).toLocaleString("en-US", { hour12: true })}</td>
                <td>{renderDeleteButton(article)}</td>
            </tr>
        );
    });

    const renderIppButtons = ITEM_OPTIONS.map((option, id) => {
        return (
            <button
                className="articles_btn"
                key={id}
                onClick={() => handleIppClick(option)}
                disabled={itemsPerPage === option}
            >
                {option}
            </button>
        );
    });

    return (
        <div className="center">
            <table id="articles">
                <thead>
                    <tr className="center">
                        <th>Author</th>
                        <th>Content</th>
                        <th>Comments</th>
                        <th>View Article</th>
                        <th>Publish Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>{renderArticles}</tbody>
            </table>
            <div className="articles_btnarea">
                <button className="articles_btn" onClick={handleLastPageClick} disabled={page <= 1}>
                    <i className="fas fa-chevron-left"></i>
                </button>
                <button
                    className="articles_btn"
                    onClick={handleNextPageClick}
                    disabled={!showNextPage}
                >
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>

            <h4>Show articles per page:</h4>
            {renderIppButtons}
        </div>
    );
};

export default ArticlePage;
