import {initializeApp} from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import {getDatabase, ref, child, get, set, update, remove} from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBYbY0ANxyvkY0d45uxBYUYnMrqDeKlf18",
  authDomain: "sock-khkt-2023-2024.firebaseapp.com",
  projectId: "sock-khkt-2023-2024",
  storageBucket: "sock-khkt-2023-2024.appspot.com",
  messagingSenderId: "799639384657",
  appId: "1:799639384657:web:ce7f2491b8e6af6b0cfe70",
  measurementId: "G-L9TMRSGQY9"
};

const app = initializeApp(firebaseConfig);

const db = getDatabase();

let name_inp = document.getElementById("name_inp");
let email_inp = document.getElementById("email_inp");
let password_inp = document.getElementById("password_inp");
let position_inp = document.getElementById("position_inp");
let status_inp = document.getElementById("status_inp");
let phone_inp = document.getElementById("num_inp");

function encodeBase64(text) {
  return btoa(unescape(encodeURIComponent(text)));
}

function decodeBase64(encodedText) {
  return decodeURIComponent(escape(atob(encodedText)));
}

let add_data = document.getElementById("add_data");//them user
let up_data = document.getElementById("update_data");//update data
let del_data = document.getElementById("del_data"); //xoa data
let print_data = document.getElementById("print_data"); //xoa data

let num_find = document.getElementById("find_num");
let find_user_btn = document.getElementById("find_user"); //find data

let ip_client;
$(document).ready(() => {
  $.getJSON("https://ipinfo.io", (response) => {
    ip_client = response.ip;
    $('#result1').html(`IP Address: ${ip_client}`);
  });
});

function addData(){
  set(ref(db, 'DataSet/' + phone_inp.value),{
    Name: name_inp.value,
    Email: email_inp.value,
    Password: encodeBase64(password_inp.value),
    Position: position_inp.value,
    Status: (status_inp.value == "yes"),
    Phone: Number(phone_inp.value)
  })
  .then(()=>{
    localStorage.setItem("Name", encodeBase64(name_inp.value));
    localStorage.setItem("Email", encodeBase64(email_inp.value));
    localStorage.setItem("Password", encodeBase64(password_inp.value));
    localStorage.setItem("Position", encodeBase64(position_inp.value));
    localStorage.setItem("Status", encodeBase64(status_inp.value));
    localStorage.setItem("Phone", encodeBase64(phone_inp.value));
    alert("Data added Successfully");

  })
  .catch((error)=>{
    alert("Failed");
    console.table(error);
  })
}

function create_node_display(name_data, email_data, password_data, position_data, status_data, phone_data) {
  const display_data_area = document.getElementById("display_data");
  const newRow = document.createElement("div");
  newRow.className = "row";
  const headings = ["Name", "Email", "Password", "Position", "Status", "Phone"];
  const values = [name_data, email_data, password_data, position_data, status_data, phone_data];
  for (let i = 0; i < headings.length; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    const heading = document.createElement("div");
    heading.className = "heading";
    heading.textContent = headings[i];
    const value = document.createElement("div");
    value.className = "value";
    value.textContent = values[i];
    cell.appendChild(heading);
    cell.appendChild(value);
    newRow.appendChild(cell);
  }
  display_data_area.appendChild(newRow);
}


function Display_data() {
  const dbRef = ref(db);
  get(child(dbRef, 'DataSet')).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val(); 
      Object.keys(data).forEach((key) => {
        const item = data[key];
        let name_table = item.Name;
        let email_table = item.Email;
        let password_table = item.Password;
        let position_table = item.Position;
        let status_table = item.Status ? "yes" : "no";
        let phone_table = item.Phone;

        create_node_display(name_table, email_table, password_table, position_table, status_table, phone_table);
      });
    } else {
      alert("DataSet is empty");
    }
  }).catch((error) => {
    alert("Failed to retrieve data");
    console.error(error);
  });
}

function display_findUser(name_data, email_data, password_data, position_data, status_data, phone_data) {
  const display_data_area = document.getElementById("find_user_display");
  const newNode = document.createElement("div");
  newNode.className = "node";
  const values = [name_data, email_data, password_data, position_data, status_data, phone_data];
  newNode.textContent = values.join(" | ");
  display_data_area.appendChild(newNode);
}

function find_user() {//khi tim user
  const dbRef = ref(db);
  let name_table, email_table, password_table, position_table, status_table, phone_table;
  get(child(dbRef, 'DataSet/' + num_find.value)).then((snapshot) => {
    if (snapshot.exists()) {
      name_table = snapshot.val().Name;          
      email_table = snapshot.val().Email; 
      password_table = snapshot.val().Password;        
      position_table = snapshot.val().Position;  
      status_table = (snapshot.val().Status) ? "yes" : "no"; 
      phone_table = snapshot.val().Phone;      
      display_findUser(name_table, email_table, password_table, position_table, status_table, phone_table);  
    } else {
      alert("Employee does not exist");
    }
  }).catch((error) => {
    alert("Failed. Please enter the correct phone number to search");
    console.table(error);
  });
}

function UpdateData(){
  update(ref(db, 'DataSet/' + phone_inp.value),{
    Name: name_inp.value,
    Email: email_inp.value,
    Password: encodeBase64(password_inp.value),
    Position: position_inp.value,
    Status: (status_inp.value == "yes"),
  })
  .then(()=>{
    alert("Data update Successfully");
  })
  .catch((error)=>{
    alert("Failed");
    console.table(error);
  })
}

function DeleteData(){
  remove(ref(db, 'DataSet/' + phone_inp.value))
  .then(()=>{
    alert("Data deleted Successfully");
  })
  .catch((error)=>{
    alert("Failed");
    console.table(error);
  })
}
add_data.addEventListener("click", () => {
  addData();
});

print_data.addEventListener("click", () => {
  Display_data();
});

find_user_btn.addEventListener("click", () => {
  find_user();
});

up_data.addEventListener("click", () => {
  UpdateData();
});

del_data.addEventListener("click", () => {
  DeleteData();
});

/* ---------------------------------------------------------------------------------------------------------------------- */
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } 
from "https://www.gstatic.com/firebasejs/10.3.0/firebase-storage.js";

var files = [];
var reader = new FileReader();

var namebox = document.getElementById('namebox');
var extlab = document.getElementById('extlab');
var myimg = document.getElementById('myimg');
var proglab = document.getElementById('progress');
var selbtn = document.getElementById('SIB');
var upbtn = document.getElementById('UIB');
var Downbtn = document.getElementById('RIB');

var input = document.createElement('input');
input.type = 'file';

input.onchange = (e) => {
  files = e.target.files;

  if (files.length > 0) {
    var extension = GetFileExt(files[0]);
    var name = GetFileName(files[0]);

    namebox.value = name;
    extlab.innerHTML = extension;
    reader.readAsDataURL(files[0]);
  }
};

reader.onload = function () {
  myimg.src = reader.result;
};

selbtn.onclick = function () {
  input.click();
};

function GetFileExt(file) {
  var temp = file.name.split('.');
  var ext = temp.slice((temp.length - 1), (temp.length));
  return '.' + ext[0];
}

function GetFileName(file) {
  var temp = file.name.split('.');
  var fname = temp.slice(0, -1).join('.');
  return fname;
}

async function UploadProcess() {
  if (files.length === 0) {
    alert("Please select a file.");
    return;
  }
  if(!Validatename()){
    alert('Error while uploading because file name contain a lot of ".", "#", "$", "[", "]"');
    return;
  }
  var ImgToUpload = files[0];
  var ImgName = namebox.value + extlab.innerHTML;
  const metaData = {
    contentType: ImgToUpload.type
  };
  const storage = getStorage();
  const storageRef = sRef(storage, 'AvatarUser/' + ImgName);
  const uploadTask = uploadBytesResumable(storageRef, ImgToUpload, metaData);

  uploadTask.on('state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      proglab.innerHTML = "Upload " + progress + "%";
      console.log('Upload is ' + progress + '% done');
    },
    (error) => {
      console.error('Upload failed:', error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('Upload successful, the download url is: ', downloadURL);
        SaveURLtoRealtimeDB(downloadURL);
      });
    }
  );
}
function SaveURLtoRealtimeDB(url){
  var name = namebox.value;
  var ext = extlab.innerHTML;
  set(ref(db, "AvatarUser/"+name),{
    ImageName:(name+ext),
    ImgUrl: url
  })
}
function GetURLfromRealtimeDB(){
  var name = namebox.value;
  var dbRef = ref(db);
  get(child(dbRef, "AvatarUser/"+name)).then((snapshot)=>{
    if(snapshot.exists()){
      myimg.src = snapshot.val().ImgUrl;
    }
  })
}
function Validatename(){
  var regex = /[\.#$\[\]]/
  return !(regex.test(namebox.value));
}
upbtn.onclick = UploadProcess;
Downbtn.onclick = function () {
  if (namebox.value) {
    GetURLfromRealtimeDB();
  } else {
    alert("Please provide a name before retrieving the image.");
  }
};
