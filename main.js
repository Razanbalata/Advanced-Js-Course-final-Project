//setupUI();



const baseUrl = "https://tarmeezacademy.com/api/v1";
let currentPage = 1
let lastPage = 1
function loginBtnClicked() {
  let username = document.getElementById("username-input").value;
  let password = document.getElementById("password-input").value;

  let parms = {
    "username": username,
    "password": password,
  };
  const url = `${baseUrl}/login`;
  toggleLoader(true)
  axios.post(url, parms).then((response) => {
    
     let token = response.data.token;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    const modal = document.getElementById("login-modal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    showAlert("logged in successfully","success");
    setupUI();
  }).catch((error)=>{
    const errorMessage = error.message
    showAlert(errorMessage,"danger")
  }).finaly(()=>{
    toggleLoader(false)
  })
}

function toggleLoader(show=true){
  if(show){
    document.getElementById("loader-div").style.visibility = "visible" 
  }else{
  document.getElementById("loader-div").style.visibility = "hidden" 
  }
}

window.addEventListener("scroll",() =>{
  const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight
  if(endOfPage && currentPage < lastPage){
    currentPage++
   // console.log(currentPage ,lastPage)
   getPosts(true,currentPage)
  }
})



function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showAlert("logged out successfully","success");
   for(post1 of posts){
    let cont = `
    <img src="${author.profile_image}">
     <span>${author.name}</span>
    `
    document.getElementById("logout-div").innerHTML += cont
   }
 // setupUI();
}

function showAlert(messagetitle,type) {
  const alertPlaceholder = document.getElementById("success-alert");
  const alert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };

  alert(messagetitle, type);
  //  setTimeout(()=>{
  //   const alertToHide = bootstrap.Alert.getOrCreateInstance('#success-alert')
  //   document.getElementById("")
  //  },2000)
  
}

function setupUI() {
  const token = localStorage.getItem("token");
  let loginDiv = document.getElementById("logged-in-div");
  let logoutDiv = document.getElementById("logout-div");
   let cearteBtn = document.getElementById("add-btn")
  if (token == null) {
    loginDiv.style.setProperty("display", "flex", "important");
    logoutDiv.style.setProperty("display", "none", "important");
   if(cearteBtn != null){
    cearteBtn.style.setProperty("display","none","important")
   }
  } else {
    loginDiv.style.setProperty("display", "none", "important");
    logoutDiv.style.setProperty("display", "flex", "important");
    if(cearteBtn != null){
      cearteBtn.style.setProperty("display","block","important")
        
    }
    const user = getCurrentUser()
    document.getElementById("nav-username").innerHTML = user.username
    document.getElementById("nav-user-image").src = user.profile_image
  }
}
setupUI();


function getCurrentUser(){
  let user = null
 let storageUser = localStorage.getItem("user")
 if(storageUser != null){
   user = JSON.parse(storageUser)  
 }
 return user
} 


function registerBtnClicked(){
  let username = document.getElementById("register-username-input").value;
  let password = document.getElementById("register-password-input").value;
  let name = document.getElementById("register-name-input").value    
  const image = document.getElementById("register-image-input").files[0]

  let formData= new FormData()
  formData.append("name", name)
  formData.append("password", password)
  formData.append("username", username)
  formData.append("image", image)

  const headers = {
     "Content-Type":"multipart/form-data",
  }
  
  const url = `${baseUrl}/register`;
  toggleLoader(true)
  axios.post(url, formData, {
    headers: headers
  }).then((response) => {
    let token = response.data.token;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    const modal = document.getElementById("register-modal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    showAlert("New User register successfully");
    setupUI();
  }).catch((error)=>{
    toggleLoader(false)
     const errorMessage = error.response.data.message
     showAlert(errorMessage,"danger")
  })
}

function editPost(postObject){
 let post = JSON.parse(decodeURIComponent(postObject)) 
 document.getElementById("edit-id-post").value = post.id
 document.getElementById("post-modal-title").innerHTML = "Edit Post"
  document.getElementById("create-post-input").value = post.title 
 document.getElementById("post-body").value = post.body
 document.getElementById("post-modal-submit-btn").innerHTML = "Edit"
 let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"),{})
  postModal.toggle()

}

function deletePost(postObject){
  let post = JSON.parse(decodeURIComponent(postObject)) 
  
 document.getElementById("delete-post-id-input").value = post.id
  document.getElementById("edit-id-post").value = post.id
  document.getElementById("post-modal-title").innerHTML = "Edit Post"
   document.getElementById("create-post-input").value = post.title 
  document.getElementById("post-body").value = post.body
  document.getElementById("post-modal-submit-btn").innerHTML = "Edit"
  let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"),{})
   postModal.toggle()
 
 }

function confirmPostDelete(){
  const postId = document.getElementById("delete-post-id-input").value 
  const token = localStorage.getItem("token")
  const headers = {
    "Content-Type":"multipart/form-data",
   "authorization":`Bearer ${token}`
 }
  const url = `${baseUrl}/posts/${postId}`;
  axios.delete(url,{
    headers: headers
  }).then((response) => {
    const modal = document.getElementById("delete-post-modal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    showAlert("The Post deleted successfully","success");
   getPosts() 
  }).catch((error) =>{
    const errorMessage = error.message
    showAlert(errorMessage,"danger")
  })
}

function addNewPost(){
  document.getElementById("edit-id-post").value = ""
  document.getElementById("post-modal-title").innerHTML = "Create New Post"
   document.getElementById("create-post-input").value =""
  document.getElementById("post-body").value = ""
  document.getElementById("post-modal-submit-btn").innerHTML = "Create"
  let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"),{})
   postModal.toggle()
}


function profileclicked(){
  const user = getCurrentUser()
  const id = user.id
  location = `profile.html?userId=${id}`
}

