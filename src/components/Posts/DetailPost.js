import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";
import { detailPostAction, deletePostAction } from "../../actions/postAction";
import LoadingTitlePost from '../Loading/LoadingTitlePost';
import LoadingContentPost from '../Loading/LoadingContentPost';

const propTypes = {
    detailPostAction: PropTypes.func.isRequired,
    detailPost: PropTypes.object.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            slug: PropTypes.string.isRequired,
        }).isRequired
    }).isRequired,
};
const DetailPost = (props) => {
    const { detailPostAction, deletePostAction, deletePost, detailPost, match, history, log } = props
    const { slug } = match.params;
    useEffect(() => {
        detailPostAction(slug);
    }, [detailPostAction, slug])
    const handleSubmit = (event) => {
        event.preventDefault();
        Swal.fire({
            title: 'Do you want to delete?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed && (log.user.role_id === 1 || detailPost.posts.user_id === log.user.id)) {
                deletePostAction(slug, history);
            }
        })
    }
    const edLinks = (
        <div className="clearfix">
            <form onSubmit={handleSubmit}>
                <Link className="btn btn-primary float-right" to={`/edit-post/${detailPost.posts.slug}`}>Edit Post</Link>
                {
                    deletePost.loading ?
                        (
                            <button type="submit" className="btn btn-danger float-right mr-3" disabled>
                                <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true" />
                                    Loading...
                            </button>
                        ) : (
                            <button type="submit" className="btn btn-danger float-right mr-3">
                                Delete Post
                            </button>
                        )
                }
            </form>
        </div>
    )
    const authLinks = (log.user.role_id === 1 || detailPost.posts.user_id === log.user.id) ? edLinks : null
    return (
        <>
            <header className="masthead" style={detailPost.loading ? { backgroundColor: '#343a40' } : { backgroundImage: 'url("/assets/img/post-bg.jpg")' }}>
                <div className="overlay" />
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-md-10 mx-auto">
                            {detailPost.loading ? <LoadingTitlePost /> :
                                <div className="post-heading">
                                    <h1>{detailPost.posts.title}</h1>
                                    <h2 className="subheading">{detailPost.posts.summary}</h2>
                                    <span className="meta">Posted by <a href="!#">{detailPost.posts.user_name}</a> on {detailPost.posts.created_at}
                                    </span>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </header>
            <article>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-md-10 mx-auto">
                            {detailPost.loading ? <LoadingContentPost /> :
                                <>
                                    <div>
                                        <p>{detailPost.posts.content}</p>
                                    </div>
                                    {authLinks}
                                </>
                            }
                        </div>
                    </div>
                </div>
            </article>
        </>
    );
}
const mapStateToProps = (state) => ({
    detailPost: state.detailPost,
    deletePost: state.deletePost,
    log: state.log
})
DetailPost.propTypes = propTypes;
export default connect(mapStateToProps, { detailPostAction, deletePostAction })(DetailPost)