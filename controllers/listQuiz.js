import { getAllQuiz, deleteQuiz, editQuizz, getQuizById } from "../services/api.js"
const app = {
    renderListQuizz: async function(){
        const data = await getAllQuiz();
        console.log(data)
        document.querySelector("tbody").innerHTML = data.map((item, index) =>{
            return ` <tr>
                        <td scope="row">${index + 1}</td>
                        <td>${item.title}</td>
                        <td>${item.time}</td>
                        <td>
                        ${item.isActive ? '<span class="badge text-bg-success">Kích hoạt</span>' : 
                            '<span class="badge text-bg-danger">Ẩn</span>'}
                        </td>
                        <td>${item.description}</td>
                        <td>
                            <button data-id= "${item.id}" class="edit_quiz btn btn-warning">Sửa</button>
                            <button data-id= "${item.id}" class="delete_quiz btn btn-danger">Xoá</button>
                        </td>
                    </tr>`
        }).join("");
        this.deleteQuiz()
        this.editQuiz()
    },
    //Xoá quizz
    deleteQuiz: function(){
        const btnDeleteQuizAl = document.querySelectorAll(".delete_quiz");
        btnDeleteQuizAl?.forEach((item) => {
            item.addEventListener("click",()=>{
               if(window.confirm("Xoá nhé!")){
                    const id = item.getAttribute("data-id");
                    deleteQuiz(id)
               }
            })
        })
    },

    // Sửa
    editQuiz: function(){
        const btnEdit = document.querySelectorAll(".edit_quiz");
        btnEdit.forEach(item => { 
            item.addEventListener('click',async () =>{
                const id = item.getAttribute("data-id");
                // Lấy quiz theo id
                const ListQuizId = await getQuizById(id);
                console.log(ListQuizId)
                // Hiển thị dữ liệu sửa theo id
                document.getElementById("content").innerHTML = `
                     <form id="editQuiz" action="" >
                            <div class="mb-3">
                                <label for="title" class="form-label">Tên Quiz</label>
                                <input type="text" class="form-control" name="quizName" value ="${ListQuizId.title}" id="title" placeholder="Nhập tên quiz" >
                            </div>
                            <div class="mb-3">
                                <label for="time" class="form-label">Thời gian (Giây)</label>
                                <input type="number" class="form-control" name="timeLimit" id="time" value ="${ListQuizId.time}"  placeholder="Nhập thời gian"  min="1">
                            </div>
                            <div class="mb-3">
                                <label>Trạng thái</label><br>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" name="status" id="isActive" ${ListQuizId.isActive ? 'checked' : ''} >
                                    <label class="form-check-label" for="isActive">Kích hoạt</label>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="description" class="form-label">Mô tả</label>
                                <textarea class="form-control" name="description" id="description" rows="3"  placeholder="Nhập mô tả">${ListQuizId.description}</textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">Sửa Quizz</button>
                        </form>
                `
                const formEdit = document.getElementById('editQuiz');
                formEdit.addEventListener("submit", (e) =>{
                    e.preventDefault();
                    this.hanlderSubmitFormEdit(id)
                    // Chuyển đến trang sửa câu hỏi (question)
                    window.location = `formEditQuestion.html?id=${id}`
                })
                
            })
        })
    },

    // Xử lí submit form sửa quizz
    hanlderSubmitFormEdit: async function(id){
        const inputTitle = document.getElementById("title")
        const inputTime = document.getElementById("time")
        const inputIsActive = document.getElementById("isActive")
        const inputDescription = document.getElementById("description");

        // console.log(inputTime.value)

        if(!inputTitle.value){
            alert("Cần nhập tiêu đề");
            inputTitle.focus();
            return
        }

        if(!inputTime.value){
            alert("Cần nhập thời gian");
            inputTime.focus();
            return
        }
      
        if(!inputDescription.value){
            alert("Cần nhập mô tả");
            inputDescription.focus();
            return
        }
        const data = {
            title: inputTitle.value,
            time: Number(inputTime.value),
            isActive: inputIsActive.checked,
            description: inputDescription.value
        }
        await editQuizz(id,data);
    },

    start: function(){
        this.renderListQuizz();
    }
}
app.start()