let carts=[];

const addCart = (maSo, maNhom) => {
    // Nhóm Mặt hàng
    getArray(Number(maNhom)).then(result => {
        let id = maSo;
        let sl = Number(document.querySelector(`#sl${id}`).value)
        // Lưu trữ vào session
        let vt = -1;
        // Lưu vào sessionStorage
        if (sessionStorage.getItem("carts") != undefined) {
            carts = JSON.parse(sessionStorage.getItem("carts"))
            vt = carts.findIndex(item => item.maso == id);
        }

        if (vt == -1) {
            let tmp = result.find(x => x.Ma_so == id);
            let cart = {
                maso: id,
                soluong: sl,
                ten: tmp.Ten,
                dongiaban: Number(tmp.Don_gia_Ban),
                manhom: maNhom
            }
            carts.push(cart) // Thêm 
        } else {
            carts[vt].soluong += sl // Cập nhật lại số lượng
        }

        if (carts.length > 0) {
            sessionStorage.setItem("carts", JSON.stringify(carts))
        } else {
            sessionStorage.removeItem("carts")
        }
        document.getElementById("Th_Giohang").innerHTML= carts.length
    })
}
const getArray = async (maNhom) => {
    let ds=[]
    if (maNhom == 1) {
        ds = await apiTivi();
    } else if (maNhom == 2) {
        ds = await apiMathang();
    } else {
        ds = await apiDienthoai();
    }
    return ds;
}
const openCart = () => {
    if (sessionStorage.getItem("carts") != undefined) {
        window.location = `../cart/`
    }
}


const xuatCart = (carts, Th_Cha) => {
    Th_Cha.innerHTML = ""
    var noi_dung_HTML = ``
    carts.forEach(tiviMua => {
        let thanhTien = tiviMua.soluong * tiviMua.dongiaban
        noi_dung_HTML += `
        <tr>
            <td scope="row" class="text-center">
                <img src=${urlImg}/${tiviMua.maso}.png style="width:80px" />
            </td >
            <td class="text-nowrap">${tiviMua.ten}</td>
            <td class="text-right">
                <input onchange="soLuong('${tiviMua.maso}',this)" type="number" min="1" max="10" value="${tiviMua.soluong}" class="text-right" />
            </td>
            <td class="text-right">${tiviMua.dongiaban.toLocaleString()}<sup>đ</sup></td>
            <td class="text-right" id="tt${tiviMua.maso}">${thanhTien.toLocaleString()}<sup>đ</sup></td>
            <td class='xoa text-center' onclick="xoaGiohang('${tiviMua.maso}')"> Xóa </td>
        </tr >
        `
    })
    noi_dung_HTML += `
        <tr>
                <td colspan="6" id="Th_Tong" style="text-align: right;" class="text-danger"></td>
                
        </tr>
    `
    Th_Cha.innerHTML = noi_dung_HTML
    tongThanhtien()

}

const tongThanhtien = () => {
    let kq = 0
    carts = JSON.parse(sessionStorage.getItem("carts"))
    carts.forEach(dt => {
        kq += dt.soluong * dt.dongiaban
    })
    Th_Tong.innerHTML = `<strong>Tổng thành tiền:</strong> ${kq.toLocaleString()}<sup>đ</sup>`
}

const soLuong = (Ma_so, input) => {
    //console.log(`Ma so:${Ma_so} - So luong ${input.value}`)
    carts = JSON.parse(sessionStorage.getItem('carts'));
    let item = carts.find(x => x.maso == Ma_so);
    //console.log(item);
    item.soluong = Number(input.value); // Cập nhật số lượng Mới
    let thanhTien = item.soluong * item.dongiaban; // Tính lại Thành tiền
    document.getElementById(`tt${Ma_so}`).innerHTML = `${thanhTien.toLocaleString()}<sup>đ</sup>` // Hiển thị thành tiền
    // Cập nhật lại session (Giỏ hàng)
    sessionStorage.setItem('carts', JSON.stringify(carts));
    tongThanhtien()
}

const xoaGiohang = (Ma_so) => {
    carts = JSON.parse(sessionStorage.getItem('carts'));
    let vt = carts.findIndex(x => x.maso == Ma_so);
    carts.splice(vt, 1);
    if (carts.length == 0) {
        Th_XoaCarts.click()
    } else {
        sessionStorage.setItem('carts', JSON.stringify(carts));
        xuatCart(carts, Th_Carts)
    }
}

const datHang = () => {
    let dsDonHang=[]
    carts = JSON.parse(sessionStorage.getItem("carts"));
    let Khach_hang = {
        "Ho_ten": document.querySelector("#Th_Ho_ten").value,
        "Dien_thoai": document.querySelector("#Th_Dien_thoai").value,
        "Email": document.querySelector("#Th_Email").value,
        "Dia_chi": document.querySelector("#Th_Dia_chi").value
    }
    carts.forEach(item=>{
        let donDathang = {
            "Ngay_Dat_hang": new Date().toLocaleString(),
            "Ngay_Giao_hang": document.querySelector("#Th_Ngay_Giao_hang").value,
            "So_luong": Number(item.soluong),
            "Don_gia_Ban": Number(item.dongiaban),
            "Tien": Number(item.soluong)*Number(item.dongiaban),
            "Trang_thai": "CHUA_GIAO_HANG",
            "Khach_hang": Khach_hang
        };
        let maso=item.maso;
        let manhom=item.manhom
        let donhang={
            key:maso,
            nhom:manhom,
            dathang:donDathang
        }
        dsDonHang.push(donhang)
        //console.log(dsDonHang);
    })
    //console.log(dsDonHang);
    // Gọi API
    // sessionStorage.setItem("khach",JSON.stringify(Khach_hang))
    // window.location=`../confrim/`
    // return false
    apiDathang(dsDonHang).then(result=>{
        console.log(result);
        sessionStorage.setItem("khach",JSON.stringify(Khach_hang))
        window.location=`../confrim/`
    }).catch(err=>{
        console.log(err);
    })
    
}

const xuatConfrimCart = (carts, Th_Cha) => {
    Th_Cha.innerHTML = ""
    var noi_dung_HTML = ``
    carts.forEach(tiviMua => {
        let thanhTien = tiviMua.soluong * tiviMua.dongiaban
        noi_dung_HTML += `
        <tr>
            <td scope="row" class="text-center">
                <img src=${urlImg}/${tiviMua.maso}.png style="width:80px" />
            </td >
            <td class="text-nowrap">${tiviMua.ten}</td>
            <td class="text-right">${tiviMua.soluong}</td>
            <td class="text-right">${tiviMua.dongiaban.toLocaleString()}<sup>đ</sup></td>
            <td class="text-right">${thanhTien.toLocaleString()}<sup>đ</sup></td>
        </tr >
        `
    })
    noi_dung_HTML += `
        <tr>
                <td colspan="5" id="Th_Tong" style="text-align: right;" class="text-danger"></td>
                
        </tr>
    `
    Th_Cha.innerHTML = noi_dung_HTML
    tongThanhtien()
    // Khách
    let khach=JSON.parse(sessionStorage.getItem("khach"))
    let html=``;
    html+=`<h4>${khach.Ho_ten} - ${khach.Dien_thoai} - ${khach.Email} - ${khach.Dia_chi}</h4>`
    document.getElementById("thKhach").innerHTML=html;  
    
}

const xacNhandonHang=()=>{
    // Gởi mail
    // Xóa Session
    sessionStorage.removeItem("khach");
    sessionStorage.removeItem("carts");
    // Chuyển trang
    console.log(khung.outerHTML)
    window.location="../home/";
    
}

