// Khai báo thư viện http của node
const http = require("http");
// Khai báo biến môi trường
require('dotenv').config();
// Khai báo cổng của dịch vụ
const port = process.env.PORT;
// Khai báo thư viện Xử lý tập tin của node
const fs = require("fs");
// Khai báo thư viện MongoDB 
const db = require("./mongoDB");
// Khai báo thư viên SendMail
const sendMail = require('./sendMail');
// Xây dựng dịch vụ
const dich_vu = http.createServer((req, res) => {
    let method = req.method;
    let url = req.url;
    let ketqua = `Dịch vụ NodeJS - Method:${method} - Url:${url}`;
    // Cấp quyền
    res.setHeader("Access-Control-Allow-Origin", '*');
    if (method == "GET") {
        if (url == "/dsTivi") {
            db.getAll("tivi").then(result => {
                res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                res.end(JSON.stringify(result));
            })
        } else if (url == "/dsHocsinh") {
            db.getAll("student").then(result => {
                res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                res.end(JSON.stringify(result));
            })
        } else if (url == "/dsMathang") {
            db.getAll("food").then(result => {
                res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                res.end(JSON.stringify(result));
            })
        } else if (url == "/Cuahang") {
            db.getAll("store").then(result => {
                res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                res.end(JSON.stringify(result));
            })
        } else if (url == "/dsDienthoai") {
            db.getAll("mobile").then(result => {
                res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                res.end(JSON.stringify(result));
            })
        } else {
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(ketqua);
        }
    } else if (method == "POST") {
        // Lấy dữ liệu client gởi về
        let noi_dung_nhan = ``;
        req.on("data", (dulieu) => {
            noi_dung_nhan += dulieu
        })

        if (url == "/Dangnhap") {
            req.on("end", () => {
                let user = JSON.parse(noi_dung_nhan);
                let dsUser = JSON.parse(fs.readFileSync("./data/Nguoi_dung.json", "utf8"));
                let nguoidung = dsUser.find(x => x.Ten_Dang_nhap == user.Ten_Dang_nhap && x.Mat_khau == user.Mat_khau);
                let kq = {
                    "noi_dung": false
                }
                if (nguoidung) {
                    kq.noi_dung = true
                }
                res.end(JSON.stringify(kq));
            })
        } else if (url == "/Lienhe") {
            req.on("end", () => {
                let kq = {
                    "noi_dung": true
                }

                let info = JSON.parse(noi_dung_nhan) //
                console.log('info', info);
                let from = `smartmedia.1537@gmail.com`;
                // let to = `joanthalassa1537@gmail.com`;

                let subject = info.tieude; //
                let body = info.noidung; //
                let to = info.email;

                sendMail.Goi_Thu_Lien_he(from, to, subject, body).then(result => {
                    console.log(result);
                    res.end(JSON.stringify(kq))
                }).catch(err => {
                    console.log(err);
                    kq.noi_dung = false;
                    res.end(JSON.stringify(kq))
                })
            })
        } else if (url == "/Dathang") {
            req.on("end", () => {
                let dsDonhang = JSON.parse(noi_dung_nhan);
                let ket_qua = { "Noi_dung": [] };
                dsDonhang.forEach(item => {
                    let collectionName="tivi"
                    collectionName=(item.nhom==2)?"food":(item.nhom==3)?"mobile":"tivi";
                    let filter = {
                        "Ma_so": item.key
                    }
                    db.getOne(collectionName,filter).then(result => {
                        item.dathang.So_Phieu_Dat = result.Danh_sach_Phieu_Dat.length + 1;
                        result.Danh_sach_Phieu_Dat.push(item.dathang);
                        // Update
                        let capnhat = {
                            $set: { Danh_sach_Phieu_Dat: result.Danh_sach_Phieu_Dat }
                        }
                        let obj = {
                            "Ma_so": result.Ma_so,
                            "Update": true
                        }
                        db.updateOne(collectionName, filter, capnhat).then(result => {
                            if (result.modifiedCount == 0) {
                                obj.Update = false

                            }
                            ket_qua.Noi_dung.push(obj);
                            if (ket_qua.Noi_dung.length == dsDonhang.length) {
                                res.end(JSON.stringify(ket_qua));
                            }
                        }).catch(err => {
                            console.log(err)
                        })
                    }).catch(err => {
                        console.log(err);
                    })

                })

            })
        } else {
            res.end(ketqua);
        }

    } else {
        res.end(ketqua);
    }

})

dich_vu.listen(port, () => {
    console.log(`Service Runing http://localhost:${port}`)
})

