const containerNode = document.querySelector('.container');
let whichCommentIdToReply = null;
!localStorage.getItem('likesMap') && localStorage.setItem('likesMap', JSON.stringify({}));

function initialize() {
    if (comments.length > 0) {
        renderComment(comments, containerNode);
    }
}

function renderComment(comments, parentContainer) {
    for(let comment of comments) {
        const commentNode = getCommentDiv(comment);
        parentContainer.appendChild(commentNode);
        if (comment.commentsOnIt.length > 0) {
            renderComment(comment.commentsOnIt, commentNode);
        }
    }
}

function addComment() {
    const comment = {
        comment: document.getElementById("comment-text").value,
        name: "kundan",
        commentsOnIt: [],
        id: getId()
    }
    const commentNode = getCommentDiv(comment);
    if (whichCommentIdToReply) {
        addCommentOnWhichItReplied(comments, comment, commentNode);
    } else {
        containerNode.appendChild(commentNode);
        comments.push(comment);
    }
    whichCommentIdToReply = null;
}

function addCommentOnWhichItReplied(comments, newComment, commentNode) {
    for (let i=0; i<comments.length; i++) {
        if(comments[i].id === whichCommentIdToReply) {
            comments[i].commentsOnIt.push(newComment);
            const parentCommentNode = document.getElementById(comments[i].id);
            parentCommentNode.appendChild(commentNode);
        }
        else if(comments[i].commentsOnIt.length) {
            addCommentOnWhichItReplied(comments[i].commentsOnIt, newComment, commentNode);
        }
    }
}

function getCommentDiv(comment) {
    const commentNode = document.createElement('div');
    commentNode.classList.add('comment-container');
    commentNode.id = comment.id;
    commentNode.style.marginLeft = "15px";
    const nameNode = document.createElement('p');
    nameNode.classList.add('comment-user-name');
    nameNode.innerText = comment.name;
    const commentDetailNode = document.createElement('p');
    commentDetailNode.classList.add('comment-user-comment');
    commentDetailNode.innerText = comment.comment;
    const likeCountNode = document.createElement('span');
    likeCountNode.innerText = 0;
    const likeButtonNode = document.createElement('a');
    likeButtonNode.classList.add('comment-like-button');
    likeButtonNode.innerText = "Like";
    likeCountNode.innerText = getInitialLikes(likeCountNode, comment);
    likeButtonNode.addEventListener('click', () => {
        updateLike(likeCountNode, comment, 1);
    })
    const replyDetailNode = document.createElement('a');
    replyDetailNode.classList.add('comment-reply-button');
    replyDetailNode.innerText = "Reply";
    replyDetailNode.addEventListener('click', () => {
        whichCommentIdToReply = comment.id;
    })
    commentNode.appendChild(nameNode);
    commentNode.appendChild(commentDetailNode);
    commentNode.appendChild(likeCountNode);
    commentNode.appendChild(likeButtonNode);
    commentNode.appendChild(replyDetailNode);
    return commentNode;
}

function updateLike(likeCountNode, comment) {
    const likesMap = JSON.parse(localStorage.getItem('likesMap'));
    likesMap[comment.id] = likesMap[comment.id] ? ++likesMap[comment.id] : 1;
    likeCountNode.innerText = likesMap[comment.id];
    JSON.parse(localStorage.setItem('likesMap', JSON.stringify(likesMap)));
}

function getInitialLikes(likeCountNode, comment) {
    const likesMap = JSON.parse(localStorage.getItem('likesMap'));
    return likesMap[comment.id] ?? 0;
}

const comments = [{
    id: 1,
    comment: "My name is kundan",
    name: 'Kundan',
    likes: 0,
    commentsOnIt : [{
        id: 2,
        comment: "My name is Raju",
        name: 'Raju',
        commentsOnIt: [],
        likes: 0
    }]
}];

function IdGenerator() {
    let id = 2;
    return () => {
        return ++id;
    }
}

const getId = IdGenerator();

initialize();