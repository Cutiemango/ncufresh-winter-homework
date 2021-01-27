import React, { useEffect, useState, useContext, useCallback, Fragment } from "react";
import { Link } from "react-router-dom";

import { UserContext, IppOptionContext } from "../app";
import { deleteData } from "./apiUtil";
import { getData } from "./apiUtil";
import "./pages.css";

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
        if (articleResponse && articleResponse.status === "OK")
            setArticles(articleResponse.articles);

        const amountResponse = await getData("article/query_amount");
        if (amountResponse && amountResponse.status === "OK")
            // there are more articles to show
            setShowNextPage(amountResponse.amount > page * itemsPerPage);
    }, [page, itemsPerPage]);

    useEffect(() => fetchArticles(), [page, itemsPerPage, fetchArticles]);

    const handleDeleteClick = async (articleId) => {
        const response = await deleteData("article/delete", {
            articleId: articleId
        });
        if (response && response.status === "OK") fetchArticles();
    };

    const handleLastPageClick = () => setPage(page - 1);
    const handleNextPageClick = () => setPage(page + 1);
    const handleIppClick = (item) => {
        setItemsPerPage(item);
        setPage(1);
    };

    const renderDeleteButton = (article) => {
        return user.id === article.authorId || user.isAdmin ? (
            <button onClick={() => handleDeleteClick(article.id)}>
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
                        <button>
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
                key={id}
                onClick={() => handleIppClick(option)}
                disabled={itemsPerPage === option}
            >
                {option}
            </button>
        );
    });

    return (
        <Fragment>
            <table id="articles">
                <thead>
                    <tr>
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
            <button onClick={handleLastPageClick} disabled={page <= 1}>
                Last Page
            </button>
            <button onClick={handleNextPageClick} disabled={!showNextPage}>
                Next Page
            </button>

            <h4>Show articles per page:</h4>
            {renderIppButtons}
        </Fragment>
    );
};

export default ArticlePage;
