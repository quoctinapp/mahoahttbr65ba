const string_inp = document.getElementById("text_inp");
const submit_btn = document.getElementById("submit");
const display_area = document.getElementById("display_encode");
const fileInput = document.getElementById("file-upload");
const pre = document.getElementById("pre");
const after = document.getElementById("after");
const close_icon = document.getElementById("close");
const file_exp = document.getElementById("file_exp");
const info_dev = document.getElementById("info_dev");

let encodedString;
let i = 0;
const speed = 100;
let txt;
let dataSet = {};

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function checkFileJson(file) {
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    if (fileExtension !== 'json') {
        return false;
    }
    return true;
}

function extractDataFromJson(jsonString) {
    const jsonObject = JSON.parse(jsonString);
    for (const key in jsonObject) {
        if (jsonObject.hasOwnProperty(key)) {
            dataSet[key] = jsonObject[key];
        }
    }
}

function getDataFromFile() {
    const file = fileInput.files[0];
    let string_data = string_inp.value;
    if (!file) {
        alert("Please insert the file config");
        return;
    } 
    if (!checkFileJson(file)) {
        alert("Error, Please input a json file");
        return;
    }
    if(!string_data){
        alert("Please insert a string");
        return; 
    }
    const reader = new FileReader();
    reader.onload = function (event) {
        const fileContent = event.target.result;
        if (isJsonString(fileContent)) {
            extractDataFromJson(fileContent);
            encodedString = encodeHTT(chuan_hoa_xau(string_data));
            txt = "Chuỗi sau khi mã hóa: " + encodedString; 
            typeWriter();
        } else {
            alert("File must be a Json structure");
            return;
        }
    };
    reader.readAsText(file);
}

function reverseString(str) { 
    const strRev =  str.split('').reverse().join(''); 
    return strRev
}

function chuan_hoa_xau(string) {
    string = string.trim();
    const normalizedString = string.replace(/\s+/g, '');
    return normalizedString;
}

function encodeBase64(text) {
    return btoa(unescape(encodeURIComponent(text)));
}

function encodeHTT(string) {
    let encodedString = '';
    for (let i = 0; i < string.length; i++) {
        const char = string[i];
        const encodedChar = dataSet[char] || char; 
        encodedString += encodedChar;
    }
    encodedString = reverseString(encodeBase64(encodedString));

    let binaryString = '';
    for (let i = 0; i < encodedString.length; i++) {
        const char = encodedString[i]; 
        const binaryChar = char.charCodeAt(0).toString(2).padStart(8, '0'); 
        binaryString += binaryChar; 
    }

    let invertedBinaryString = '';
    for (let i = 0; i < binaryString.length; i++) {
        const bit = binaryString[i];
        const invertedBit = bit === '1' ? '0' : '1';
        invertedBinaryString += invertedBit;
    }

    const n = invertedBinaryString.length;
    let swappedBinaryString = '';
    for (let i = 0; i < n; i += 2) {
        swappedBinaryString += invertedBinaryString[ (i + 2 * (i / 2 + n)) % (n-1) ]; // (i+2)%n 
    }

    let decodedString = '';
    for (let i = 0; i < swappedBinaryString.length; i += 8) {
        const binaryChar = swappedBinaryString.substr(i, 8); 
        
        const charCode = parseInt(binaryChar, 2); 
        const isValidChar = charCode >= 32 && charCode <= 128; 
        if (isValidChar) {
            const char = String.fromCharCode(charCode); 
            decodedString += char; 
        }
    }
   
    return reverseString(decodedString); // return decodedString
}

let isFirstInput = true;
submit_btn.addEventListener('click', function() {
    if (isFirstInput) {
        getDataFromFile(); 
        isFirstInput = false; 
    } else {
        location.reload(true); 
    }
});

function typeWriter() {
    if (i < txt.length) {
        display_area.innerHTML += txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    }
}

document.addEventListener('copy', function(e){
    e.preventDefault();
    const clipboardData = e.clipboardData || window.clipboardData;
    clipboardData.setData('text', encodedString);
});

string_inp.addEventListener('input', function(e) {
    string_inp.style.height = "auto";
    let scHeight = e.target.scrollHeight;
    e.target.style.height = `${scHeight}px`;
});

function saveTextareaData() {
    const textareaData = string_inp.value;
    localStorage.setItem('textareaData', textareaData);
}

function restoreTextareaData() {
    const savedTextareaData = localStorage.getItem('textareaData');
    if (savedTextareaData) {
        string_inp.value = savedTextareaData;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    restoreTextareaData();
});

string_inp.addEventListener('input', () => {
    saveTextareaData();
});

file_exp.addEventListener('click', function(e){
    e.preventDefault();
    const link = "https://drive.google.com/file/d/1Rv4hdH69eDVfGOzTVEBXxOD_j_NMoWLr/view?usp=sharing";
    window.open(link, '_blank');
});

info_dev.addEventListener('click', function(e){
    e.preventDefault();
    const link = "https://www.facebook.com/quoctin.lytran.75";
    window.open(link, '_blank');
});

pre.addEventListener('click', function(e){
    after.style.visibility = "visible";
    after.style.opacity = "1";
    after.style.pointerEvents = "auto";
    pre.style.visibility = "hidden";
    pre.style.opacity = "0";
    pre.style.pointerEvents = "none";
});

close_icon.addEventListener('click', function(e){
    after.style.visibility = "hidden";
    after.style.opacity = "0";
    after.style.pointerEvents = "none";
    pre.style.visibility = "visible";
    pre.style.opacity = "1";
    pre.style.pointerEvents = "auto";
});

