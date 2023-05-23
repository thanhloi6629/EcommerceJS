let dsTivi=[];
let dsNhom=[];
let ds=[];
const xuatTivi=(ds=[],tag,nhom=1)=>{
    let html=``
    ds.forEach(item=>{
        html+=`
            <div class="col mb-5">
                <div class="card h-100">
                    <!-- Product image-->
                    <img class="card-img-top" src="${urlImg}/${item.Ma_so}.png" alt="..." onclick="showModal(this)" />
                    <!-- Product details-->
                    <div class="card-body p-4">
                        <div class="text-center">
                            <!-- Product name-->
                            <h5 class="fw-bolder">${item.Ten}<br>${item.Ma_so}</h5>
                            <!-- Product reviews-->
                            <!--
                            <div class="d-flex justify-content-center small text-warning mb-2">
                                <div class="bi-star-fill"></div>
                                <div class="bi-star-fill"></div>
                                <div class="bi-star-fill"></div>
                                <div class="bi-star-fill"></div>
                                <div class="bi-star-fill"></div>
                            </div>
                            -->
                            <!-- Product price-->
                            <span class="text-muted">
                            ${item.Don_gia_Ban.toLocaleString()}<sup>đ</sup>
                            </span>
                            <br/>
                            <input type="number" min="1" max="10" value="1" style="width:50px;text-align:right" id="sl${item.Ma_so}">
                        </div>
                    </div>
                    <!-- Product actions-->
                    <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                        <div class="text-center">
                        <a class="btn btn-outline-dark mt-auto" href="javaScript:void(0)" onclick="addCart('${item.Ma_so}',${nhom})">
                        Add to cart
                        </a>
                        </div>
                    </div>
                </div>
            </div>
        `
        tag.innerHTML=html;
    })
}

const taoNhom=()=> {
    dsNhom = Array.from(new Set(dsTivi.map(x => x.Nhom.Ma_so))).map(Ma_so => {
        nhom = {
            Ma_so: Ma_so,
            Ten: dsTivi.find(x => x.Nhom.Ma_so == Ma_so).Nhom.Ten
        }
        return nhom
    })


}

const xuatNhom=()=>{
    let html=`<button id="ALL" onclick="locNhom('ALL')"  class="nhom activeNut">All</button>`
    dsNhom.forEach(nhom=>{
        html+=`
            <button class="nhom" id=${nhom.Ma_so} onclick="locNhom('${nhom.Ma_so}')">${nhom.Ten}</button>
        `
    })
    thNhoms.innerHTML=html;
}

const activeNut=()=>{
    document.querySelectorAll(".nhom").forEach(nut=>{
        nut.onmouseup=()=>{
            document.querySelectorAll(".activeNut")[0].classList.remove("activeNut");
            nut.classList.add("activeNut")
        }
    })
}

const locNhom=(maNhom)=>{
    ds=dsTivi;
    if(maNhom!="ALL"){
        ds=dsTivi.filter(item=>item.Nhom.Ma_so==maNhom)
    }
    xuatTivi(ds,thTivis)
}

const sapxepTen=(tag)=>{
    let key=tag.getAttribute("key-sort");
    if(key==0){
        tag.setAttribute("key-sort",1);
        tag.innerHTML="Tên &bigtriangledown;"
        // Tăng
        ds.sort((a,b)=>{
            return a.Ten.toLowerCase().localeCompare(b.Ten.toLowerCase()) 
        })
    }else{
        tag.setAttribute("key-sort",0)
        tag.innerHTML="Tên &bigtriangleup;"
        // Giảm
        ds.sort((a,b)=>{
            return b.Ten.toLowerCase().localeCompare(a.Ten.toLowerCase()) 
        })
    }
    xuatTivi(ds,thTivis)
}

const sapxepGia=(tag)=>{
    let key=tag.getAttribute("key-sort");
    if(key==0){
        tag.setAttribute("key-sort",1);
        tag.innerHTML="Giá &bigtriangledown;"
        // Tăng
        ds.sort((a,b)=>{
            return a.Don_gia_Ban - b.Don_gia_Ban
        })
    }else{
        tag.setAttribute("key-sort",0)
        tag.innerHTML="Giá &bigtriangleup;"
        // Giảm
        ds.sort((a,b)=>{
            return b.Don_gia_Ban - a.Don_gia_Ban
        })
    }

    xuatTivi(ds,thTivis)

}

const Loc_Gia=(gia)=>{
    let dsLoc=ds.filter(x=>Number(x.Don_gia_Ban) <= Number(gia))
    lblGia.innerHTML=`Giá: ${Number(gia).toLocaleString()}<sup>đ</sup> (${dsLoc.length})`;
    xuatTivi(dsLoc,thTivis)
    
}

const KeyCode=(event)=>{

    if (event.keyCode == 13) {
        let gt = event.target.value
        let dsTim = ds.filter(x => x.Ten.toLowerCase().includes(gt.toLowerCase()))
        xuatTivi(dsTim,thTivis)
    }
}

const Tim=(gt)=>{
        let dsTim = ds.filter(x => x.Ten.toLowerCase().includes(gt.toLowerCase()))
        xuatTivi(dsTim,thTivis)
    
}

const showMore =(num)=>{
    if(num=="ALL"){
        ds=dsTivi.slice(0);
    }else{
        ds=dsTivi.slice(0,Number(num));
    }

    xuatTivi(ds,thTivis)
}

