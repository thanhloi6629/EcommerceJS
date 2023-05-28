// api: https://api.cloudinary.com/v1_1/<cloud_name>/drahkjifm/image/upload;
// urlImg: https://res.cloudinary.com/drahkjifm/image/upload/v1/<folder>/<img_name>


// const url ="https://api.cloudinary.com/v1_1/pyuso01q/image/upload"
// const urlImg= `https://res.cloudinary.com/dpndp5u78/image/upload/v1/images/`


const url = "https://api.cloudinary.com/v1_1/loivo/image/upload";
const urlImg= `https://res.cloudinary.com/loivo/image/upload/v1/images/`



const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const files = document.querySelector("[type=file]").files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let name=file.name.split(".")[0]
        
        formData.append("file", file);
        formData.append("public_id", name);
        formData.append("folder", "images/");
        formData.append("upload_preset", 'pyuso01q');
        
        fetch(url, {
            method: "POST",
            body: formData
        }).then((response) => {
            
            return response.text();
        }).then((data) => {
            let img=JSON.parse(data);
            console.log(img);
            //document.getElementById("data").innerHTML += data;
            document.getElementById("data").innerHTML += Xuat(img);
        });
    }
});

const Xuat=(img)=>{
    let html=`
        <img src="${img.secure_url}" />
    `
    return html;
}