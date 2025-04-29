
function getPosts(reload=true,page=1) {
    toggleLoader(true)
  axios.get(`${baseUrl}/posts?limit=6&page=${page}`).then((response) => {
    toggleLoader(false) 
    let count = 0;
      let posts = response.data.data;
      lastPage = response.data.meta.last_page
    
      
     
      for (let post of posts) {
        let author = posts[count].author;
        let postTitle = "";
        
        // if(reload) {
        //   document.getElementById("posts").innerHTML =""
        // }    

        if (post.title != null) {
          postTitle = post.title;
        }
        let user = getCurrentUser()
        let isMyPost = user!= null && post.author.id == user.id 
        let editBtn = ``

        if(isMyPost){
            editBtn = `
             <button class="btn btn-danger" style="float:right" onclick="deletePost('${encodeURIComponent(JSON.stringify(post))}')">Delete</button>
            <button class="btn btn-secondary" style="margin-right:10px;float:right" onclick="editPost('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>

            `
        }
        
        
        let content = `
           <div class="card shadow my-3">
            <div class="card-header">
            <span onclick="userClicked(${author.id})" style="cursor:pointer">
            <img src="${author.profile_image}" class="rounded-circle border border-3" style="width: 40px;height: 40px;">
             <b >${author.name}</b>
             </span>
              
               ${editBtn}
             </div>
            <div class="card-body" onclick="postClicked(${post.id})" style="cursor:pointer">
              <img src="${post.image}" class="w-100">
              <h6 style="color: rgb(173, 173, 173);" class="mt-1">${post.created_at}</h6>
              <h5>${postTitle}</h5>
              <p>${post.body}</p>
              <hr> 
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                  <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                </svg>
                <span>(${post.comments_count}) Comments </span>
               <span id="post-tags-${post.id}"></span>
                </div>
            </div>
          </div>
          `;
        document.getElementById("posts").innerHTML += content;
        count++;

        const currentPostTag = `post-tags-${post.id}`;
        document.getElementById(currentPostTag).innerHTML = "";
        for (tag of post.tags) {
          let TagContent = `"
       <button class="btn btn-sm rounded-5" style="background-color:gray;color:#fff">
        ${tag.name}
       </button>
      `;
          document.getElementById(currentPostTag).innerHTML += TagContent;
        }
      }
    });
  }
getPosts()

  function createBtnClicked(){
   let postId = document.getElementById("edit-id-post").value
   let isCreate = postId == null || postId == ""


const title = document.getElementById("create-post-input").value;
const body = document.getElementById("post-body").value;
const image = document.getElementById("create-post-img").files[0]
const token = localStorage.getItem("token")

let formData= new FormData()
formData.append("body", body)
formData.append("title", title)
formData.append("image", image)

let url = ``

const headers = {
    "Content-Type":"multipart/form-data",
   "authorization":`Bearer ${token}`
 }

if(isCreate){
    url = `${baseUrl}/posts`
    
}else{
    
    formData.append("_method","put")
    url = `${baseUrl}/posts/${postId}`
    
}
axios.post(url, formData, {
    headers: headers
  }).then((response) => {
    const modal = document.getElementById("create-post-modal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    showAlert("New Post Create successfully","success");
   getPosts()
  }).catch((error)=>{
    const errorMessage = error.message
    showAlert(errorMessage,"danger")
  })

}


function postClicked(id){
location = `postDetails.html?postId=${id}`
}
 function userClicked(userId){
 location = `profile.html?userId=${userId}`
 }



