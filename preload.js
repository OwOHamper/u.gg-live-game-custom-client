const fs = require('fs')
const path = require('path');

document.addEventListener('DOMContentLoaded', (event) => {
    // loading custom css
    fs.readFile(path.join(__dirname, 'style.css'), 'utf-8', (err, data) => {
        console.log(err)
            var link = document.createElement("style")
            link.type = "text/css"
            link.innerText = data
            document.head.appendChild(link)
    })
    // setting custom local storage with region
    // read json file
    fs.readFile(path.join(__dirname, 'config.json'), 'utf-8', (err, data) => {
        let config = JSON.parse(data)
        localStorage.setItem('summonerRegion', config.region)
    })
    
});


