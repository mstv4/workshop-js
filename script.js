"use strict";

const API_URL = "https://gorest.co.in/public/v2/users?per_page=20";
const POST_URL = "https://gorest.co.in/public/v2/posts";
const COMMENT_URL = "https://gorest.co.in/public/v2/comments";

const usersList = document.getElementById("users-list");
const userPostsDiv = document.getElementById("user-posts");
const postCommentsDiv = document.getElementById("post-comments");

/* відмальовуєм блок з юзерами */
function renderUsers(users) {
  users.forEach((user) => {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.href = "#";
    link.textContent = user.name;
    link.addEventListener("click", () => {
      getUserPosts(user.id);
    });
    listItem.appendChild(link);
    usersList.appendChild(listItem);
  });
}

/* отримуєм список юзерів */
async function getUsers() {
  try {
    const responseUsers = await fetch(API_URL);
    const data = await responseUsers.json();

    if (data.length > 0) {
      renderUsers(data);
    } else {
      usersList.textContent = "Users not found";
    }
  } catch (error) {
    console.error("An error occurred while retrieving the list of users", error);
    usersList.innerHTML = "<p>An error occurred while retrieving the list of users</p>";
  }
}

/* відмальовуєм блок з постами */
function renderUserPosts(posts) {
  userPostsDiv.innerHTML = "";

  if (posts.length > 0) {
    posts.forEach((post) => {
      const postDiv = document.createElement("div");
      postDiv.className = "post";
      postDiv.innerHTML = `
        <div class="post-title"><a href="#">${post.title}</a></div>
        <div class="post-body">${post.body}</div>
      `;
      postDiv.addEventListener("click", () => {
        getPostComments(post.id);
      });
      userPostsDiv.appendChild(postDiv);
    });
  } else {
    userPostsDiv.textContent = "This user has no posts";
  }

  const backButton = document.createElement("button");
  backButton.innerHTML = "Back";
  backButton.addEventListener("click", () => {
    usersList.style.display = "block";
    userPostsDiv.innerHTML = "";
    postCommentsDiv.innerHTML = "";
  });
  userPostsDiv.appendChild(backButton);

  usersList.style.display = "none";
}

/* отримуєм список постів */
async function getUserPosts(userId) {
  const url = `${POST_URL}?user_id=${userId}`;
  try {
    const responsePosts = await fetch(url);
    const data = await responsePosts.json();

    renderUserPosts(data);
  } catch (error) {
    console.error("An error occurred while retrieving the list of posts", error);
    userPostsDiv.innerHTML ="<p>An error occurred while retrieving the list of posts</p>";
  }
}

/* відмальовуєм блок з коментарями */
function renderPostComments(postData) {
  postCommentsDiv.innerHTML = "";

  if (postData.length > 0) {
    const commentsDiv = document.createElement("div");
    commentsDiv.className = "comments";
    commentsDiv.innerHTML = "<h2>Comments:</h2>";
    postData.forEach((comments) => {
      const commentDiv = document.createElement("div");
      commentDiv.className = "comment";
      commentDiv.innerHTML = `
          <div class="comment-name">${comments.name}</div>
          <div class="comment-body">${comments.body}</div>
        `;
      commentsDiv.appendChild(commentDiv);
    });
    postCommentsDiv.appendChild(commentsDiv);
  } else {
    postCommentsDiv.innerHTML += "<p>There are no comments</p>";
  }
}

/* отримуєм список коментарів */
async function getPostComments(postId) {
  const url = `${COMMENT_URL}?post_id=${postId}`;
  try {
    const responseComments = await fetch(url);
    const data = await responseComments.json();

    renderPostComments(data);
  } catch (error) {
    console.error("An error occurred while retrieving the list of comments", error);
    postCommentsDiv.innerHTML = "<p>An error occurred while retrieving the list of comments</p>";
  }
}

getUsers();