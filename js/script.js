// Download a file form a url.
let saveFile = (url) => {
    // credit - https://ausdemmaschinenraum.wordpress.com/2012/12/06/how-to-save-a-file-from-a-url-with-javascript/
    // Get file name from url.
    var filename = url.substring(url.lastIndexOf("/") + 1).split("?")[0];
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function () {
        var a = document.createElement('a');
        a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
        a.download = filename; // Set the file name.
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        delete a;
    };
    xhr.open('GET', url);
    xhr.send();
}

let instavalidator = (url) => {
    return url.match(/https:\/\/www\.instagram\.com\/p\/[0-9a-zA-Z_-]+\//gi) !== null;
}

// POSTs url to server.
// Server should respond with an image or video url
let instalooter = (url) => {
    return new Promise((resolve, reject) => {
        // POST request options
        var postOptions = {
            method: 'POST',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify({
                url: url
            })
        }

        // POST request to /instaloot
        fetch("/instaloot", postOptions)

            .then((res) => {
                if (res.ok) {
                    return res.text();
                }
                else {
                    throw "It's not ok, captain. I WENT TOO RICKY RICARDO"
                }
            })

            .then((text) => {
                // text is the url of the instagram image/video
                resolve(text);
            })

            .catch((err) => {
                console.error(err);
                reject(err);
            })
    });
}

document.getElementById("download").addEventListener("click", (evt) => {
    evt.preventDefault(); // prevent any postback

    let urlInput = document.getElementById("url");
    let igUrl = urlInput.value;

    if (instavalidator(igUrl) === true) {
        instalooter(urlInput.value)
            .then((url) => {
                saveFile(url);
            })
            .catch((err) => {
                console.error(err);
            })
    }
    else {
        window.alert("Please enter a valid Instagram URL");
    }
});