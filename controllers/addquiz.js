import { addQuizz } from "../services/api.js";
const app = {
    hanlerAdd: function(){
        const form = document.getElementById("addForm").addEventListener("submit",async (e)=>{
            // Ngăn chặn hành vi load trang
            e.preventDefault();
            // Lấy input
            const inputTitle = document.getElementById('title');
            const inputIsActive = document.getElementById("isActive");
            const inputTime = document.getElementById("time");
            const inputDescription = document.getElementById("description");
            //Validate
            if(!inputTitle.value.trim()){
                alert("Cần nhập thông tin tên quiz");
                inputTitle.focus();
                return // Ngăn chặn thực thi các tác vụ tiếp theo
            }

            if(!inputTime.value.trim()){
                alert("Cần nhập thời gian");
                inputTime.focus();
                return // Ngăn chặn thực thi các tác vụ tiếp theo
            }

            if(!inputDescription.value.trim()){
                alert("Cần nhập mô tả");
                inputDescription.focus();
                return // Ngăn chặn thực thi các tác vụ tiếp theo
            }
            // Lấy giữ liệu
            const data = {
                title: inputTitle.value,
                isActive: inputIsActive.checked,
                time: Number(inputTime.value),
                description: inputDescription.value || ""
            }
            // console.log(data);
            const res = await addQuizz(data)
            window.location = `addquestion.html?id=${res.id}`
            alert("Thêm thành công");
        })
    },
    start: function(){
        this.hanlerAdd();
    }
}
app.start();