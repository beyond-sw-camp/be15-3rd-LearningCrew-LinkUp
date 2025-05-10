import api from '@/api/axios.js';

// 게시글 목록 불러오기 (페이징)
// export const fetchPosts = (page, size) => {
//     return api.get(`/common-service/posts?page=${page}&size=${size}`);
// };
export const fetchPosts = (page, size, searchType, keyword) => {
    return api.get('/common-service/posts', {
        params: {
            page,
            size,
            searchType,
            keyword,
        },
    });
};

const fetchPostById = (id) => api.get(`/common-service/posts/${id}`);

const createComment = (postId, commentContent, userId) => {
    return api.post(`/common-service/posts/${postId}/comments`, {
        commentContent,
        userId,
    });
};

export const createPost = (data) => api.post('/common-service/posts', data);

export const uploadImages = (postId, formData) =>
        api.post(`/common-service/posts/${postId}/images`, formData);


const updatePost = (postId, data) => {
    return api.put(`/common-service/posts/${postId}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};


const deletePost = (postId, userId) => {
    return api.put(`/common-service/posts/${postId}/delete?userId=${userId}`);
};

const likePost = (postId, userId) => {
    return api.post(`/common-service/posts/${postId}/likes?userId=${userId}`);
};

const unlikePost = (postId, userId) => {
    return api.delete(`/common-service/posts/${postId}/likes?userId=${userId}`);
};


const likeComment = (commentId, userId) => {
    return api.post(`/common-service/comments/${commentId}/likes?userId=${userId}`);
};

const unlikeComment = (commentId, userId) => {
    return api.delete(`/common-service/comments/${commentId}/likes?userId=${userId}`);
}

const fetchComments = (postId, userId) => {
    return api.get(`/common-service/comments/post/${postId}`, {
        params: { userId }
    });
};

const deleteComment = (postId, commentId, userId) => {
    return api.put(`/common-service/posts/${postId}/comments/${commentId}/delete`, null, {
        params: { userId },
    });
};


export default {
    fetchPosts,
    fetchPostById,
    createComment,
    createPost,
    updatePost,
    deletePost,
    uploadImages,
    likePost,
    unlikePost,
    likeComment,
    unlikeComment,
    fetchComments,
    deleteComment,
};