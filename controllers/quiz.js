import { getAllQuiz } from "../services/api.js";
const app = {
    // Hiển thị câu hỏi
    renderlistQuiz: async function(){
        // 1. Lấy danh sách câu hỏi
        const data = await getAllQuiz(); 
        // console.log(data); // đồng bộ
        
        // Đổ dữ liệu ra
        const listQuizz = data?.map((item, index) =>{
           if(item.isActive){ // Nếu true thì mới hiển thị
            return `<a data-id="${item.id}" href="#"class="quizzitem list-group-item list-group-item-action list-group-item-primary">
            ${item.title}: ${item.description}
            </a>`
           }
        }).join("");
        const listQuizElement = document.getElementById("list_quiz");
        listQuizElement.innerHTML = listQuizz;
        this.handClickQuizz();
    },
    handClickQuizz: function(){
        const quizItem = document.querySelectorAll('.quizzitem');
        // console.log(quizItem);
        quizItem.forEach((item) => {
            item.addEventListener('click', ()=>{
                //3. Xác nhận
                const title = item.textContent;
                if(window.confirm(`Bạn có chắc chắn làm quiz: ${title}`)){
                    // Lấy id
                    const id = item.getAttribute("data-id")
                    // Chuyển trang
                    window.location = `question.html?id=${id}`;
                }
            })
        })
    },

    
    start: function(){
       this.renderlistQuiz()
        //render: Hiển thị giao diện
        //handle: Thực thi logic
    }
}
app.start();