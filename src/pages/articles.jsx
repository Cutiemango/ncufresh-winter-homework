import React, { useEffect, useState, useContext, useCallback, Fragment } from 'react'
import { Link } from 'react-router-dom'

import { UserContext } from '../app'
import { deleteData } from './apiUtil'
import { getData } from './apiUtil'
import './pages.css'

const ArticlePage = () => {
    const [page, setPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [articles, setArticles] = useState([])
    const { user } = useContext(UserContext)

    const fetchData = useCallback(async () => {
        const response = await getData('article/query_batch', {
            page: page,
            ipp: itemsPerPage
        })
        if (response && response.status === 'OK')
            setArticles(response.articles)
    }, [page, itemsPerPage])

    useEffect(() => fetchData(), [page, itemsPerPage, fetchData])

    const handleDeleteClick = async (articleId) => {
        const response = await deleteData('article/delete', {
            articleId: articleId
        })
        if (response && response.status === 'OK')
            fetchData()
    }

    const renderArticles = () => {
        return (
            <Fragment>
                {articles.map((article, idx) => {
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
                            <td>{new Date(article.postTimeStamp).toLocaleString('en-US', { hour12: false })}</td>
                            <td>{user.id === article.authorId ? 
                                    <button onClick={() => handleDeleteClick(article.id)}>
                                        <i className="fas fa-times-circle"></i>
                                    </button>
                                    :
                                    <p> </p>
                                }
                            </td>
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
                    <th>View Article</th>
                    <th>Publish Date</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {renderArticles()}
            </tbody>
        </table>
    )
}

export default ArticlePage