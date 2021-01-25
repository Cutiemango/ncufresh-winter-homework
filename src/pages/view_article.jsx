import React, { useState, useEffect, useContext, useCallback, Fragment } from 'react'

import { UserContext } from '../app'
import { getData, postData, deleteData } from './apiUtil'

import './pages.css'

const ViewArticlePage = (props) => {
    const articleId = props.match.params.id

    const [article, setArticle] = useState({
        authorName: "",
        content: "",
        comments: [],
        postTimeStamp: Date.now()
    })
    const [comment, setComment] = useState("")

    const { user } = useContext(UserContext)

    const fetchData = useCallback(async () => {
        const response = await getData('article/query', {
            articleId: articleId
        })
        if (response && response.status === 'OK')
            setArticle(response.article)
    }, [articleId])

    useEffect(() => fetchData(), [articleId, fetchData])

    const handleDeleteClick = async (commentId) => {
        const response = await deleteData('comment/delete', {
            articleId: articleId,
            commentId: commentId
        })
        if (response && response.status === 'OK')
            fetchData()
    }

    const renderComments = (comments) => {
        return (
            comments.map((comment, idx) => {
                return (
                    <Fragment key={idx}>
                        <h4>{comment.authorName} 發表於 {new Date(comment.postTimeStamp).toLocaleString('en-US', { hour12: false })}
                            {user.id === comment.authorId && <button onClick={() => handleDeleteClick(comment.id)}><i className="fas fa-times-circle"></i></button>}
                        </h4>
                        <p>{comment.content}</p>
                    </Fragment>
                )
            })
        )
    }

    const handleChange = (event) => {
        setComment(event.target.value)
    }

    const handleCreateClick = async () => {
        const response = await postData('comment/create', {
            articleId: articleId,
            content: comment,
            timeStamp: Date.now()
        })
        if (response && response.status === 'OK')
        {
            setComment("")
            fetchData()
        }
    }

    return (
        <Fragment>
            <h4>{article.authorName} 發表於 {new Date(article.postTimeStamp).toLocaleString('en-US', { hour12: false })}</h4>
            <p>{article.content}</p>
            <h4>留言</h4>
            {renderComments(article.comments)}
            <h4>新增回覆：</h4>
            <textarea id='create_comment' onChange={handleChange} value={comment}></textarea>
            <button id='create_comment_btn' onClick={handleCreateClick}>Submit</button>
        </Fragment>
    )
}

export default ViewArticlePage