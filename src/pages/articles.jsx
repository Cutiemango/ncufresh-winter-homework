import React, { useEffect, useState, Fragment } from 'react'

import { getData } from './apiUtil'
import './pages.css'

const ArticlePage = () => {
    const [page, setPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [articles, setArticles] = useState([])

    const fetchArticles = () => {
        const fetchData = async () => {
            const response = await getData('article/query_batch', {
                page: page,
                ipp: itemsPerPage
            })
            if (response && response.articles)
                setArticles(response.articles)
        }

        fetchData()
    }

    useEffect(fetchArticles, [page, itemsPerPage])

    const renderArticles = () => {
        return (
            <Fragment>
                {articles.map((article, idx) => {
                    return (
                        <tr key={idx}>
                            <td>{article.authorName}</td>
                            <td>{article.content}</td>
                            <td>{article.comments.length}</td>
                            <td>{new Date(article.postTimeStamp).toLocaleString('en-US', { hour12: false })}</td>
                        </tr>
                    )
                })}
            </Fragment>
        )
    }

    return (
        <table id='articles'>
            <thead>
                <tr>
                    <th>Author</th>
                    <th>Content</th>
                    <th>Comments</th>
                    <th>Publish Date</th>
                </tr>
            </thead>
            <tbody>
                {renderArticles()}
            </tbody>
        </table>
    )
}

export default ArticlePage