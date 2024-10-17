import { addQuestions} from "../services/api.js";
const app = {
    renderQuestion: function(){
        // Lấy độ dài của mảng
        const currentQuestion = document.querySelectorAll(".question_item")?.length + 1 || 1;
        // Thêm mới dữ liệu câu hỏi

        const listQuestion = document.getElementById("list_question");
        const divEl = document.createElement('div');
        console.log(divEl)
        divEl.classList = `question_item border border-2 rounded p-4 mb-2`
        divEl.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <h4 class="question_number">Câu hỏi: ${currentQuestion}</h4>
                <button class="btn btn-danger btn-close deleteQuess"></button>
            </div>
                <div class="mb-3">
                    <label for="question_content_${currentQuestion}" class="form-label">Nội dung câu hỏi</label>
                    <textarea class="form-control" name="question_1" id="question_content_${currentQuestion}" rows="3"></textarea>
                </div>
            
                
                <div class="answer_items mt-3">
                    <div class="form-check fs-5 mb-3">
                        <input class="form-check-input" role="button" type="radio" name="question_${currentQuestion}" id="check_${currentQuestion}_1">
                        <div class="mb-3">
                            <input
                                type="text"
                                class="form-control"
                                name="answer_1_1"
                                id="answer_${currentQuestion}_1"
                                placeholder="Nhập câu trả lời 1"
                            />
                        </div>         
                    </div>

                    <div class="form-check fs-5 mb-3">
                        <input class="form-check-input" role="button" type="radio" name="question_${currentQuestion}" id="check_${currentQuestion}_2">
                        <div class="mb-3">
                            <input
                                type="text"
                                class="form-control"
                                name="answer_1_2"
                                id="answer_${currentQuestion}_2"
                                placeholder="Nhập câu trả lời 2"
                            />
                        </div>    
                    </div>

                    <div class="form-check fs-5 mb-3">
                        <input class="form-check-input" role="button" type="radio" name="question_${currentQuestion}" id="check_${currentQuestion}_3">
                        <div class="mb-3">
                            <input
                                type="text"
                                class="form-control"
                                name="answer_1_3"
                                id="answer_${currentQuestion}_3"
                                placeholder="Nhập câu trả lời 3"
                            />
                        </div>    
                    </div>

                    <div class="form-check fs-5 mb-3">
                        <input class="form-check-input" role="button" type="radio" name="question_${currentQuestion}" id="check_${currentQuestion}_4">
                        <div class="mb-3">
                            <input
                                type="text"
                                class="form-control"
                                name="answer_1_4"
                                id="answer_${currentQuestion}_4"
                                placeholder="Nhập câu trả lời 4"
                            />
                        </div>    
                    </div>
                </div>`
        listQuestion.appendChild(divEl);

       const contenQuestion = document.getElementById(`question_content_${currentQuestion}`);
       contenQuestion?.focus()
       contenQuestion?.scrollIntoView({behavior: "smooth"})

       // Xoá theo ô
       this.deleteQuestion(divEl)
    },
    handleAdd: function(){
        document.getElementById("btn_add").addEventListener("click",()=>{
            this.renderQuestion()
        })
    },
    handleSubmit: function(){
        document.getElementById("btn_submit").addEventListener("click", async()=>{
            // Lấy ra các câu hỏi và trả lời theo nhóm

            const listData = document.querySelectorAll(".question_item");
            //Lấy id trên URL
            const searchParam = new URLSearchParams(window.location.search);
            let idQuiz;
            if(searchParam.has("id")){
                idQuiz= searchParam.get("id");
            }
            // console.log(idQuiz)
            const data = [];
            for (var i = 0; i < listData.length; i++) {
                // Lấy nội dung câu hỏi
                const questionContent = document.getElementById(`question_content_${i+1}`);
                // console.log(questionContent);
                // Lấy radio
                const check = listData[i].querySelectorAll('input[type="radio"]')
                // console.log(check);

                //Lấy nội dung đáp án
                const answerlist = listData[i].querySelectorAll('input[type="text"]');

                //validate
                const isCheck = this.validate(questionContent,check, answerlist);
                if(!isCheck){
                    break;
                }
                const item = {
                    questionTiltle: questionContent.value,
                    answers: [],
                    quizId: idQuiz,
                    type: 1,
                    correctAnser:[]
                }
                answerlist.forEach((ans,index) =>{
                    item.answers.push({
                        id: (index + 1 ).toString(),
                        answerTitle: ans.value
                    }

                    );
                })
                check.forEach((i,index) =>{
                    if(i.checked){
                        item.correctAnser.push(index + 1).toString()
                    }
                })
                data.push(item);
            }
            console.log(data)
            if(data.length == listData.length){
                await addQuestions(data);
                window.location = 'index.html'
            }
            
        })
    },

    validate: function(questionContent,check, answerlist){
        // validate câu hỏi
        if(!questionContent.value.trim()){
            alert("Cần nhập nội dung câu hỏi");
            questionContent.focus();
            return false;
        }
        // Validate đáp án đúng
        var isCheckRadio = false
        for (var i = 0; i < check.length; i++) {
            if(check[i].checked == true){
                isCheckRadio = true;
                break;
            }
        }
        if(!isCheckRadio){
            alert("Cần lựa chọn đáp án đúng")
            check[0].focus()
            return false
        }

        //Validate đáp án
        var ischeckAnwser = true;
        for (var i = 0; i < answerlist.length; i++) {
            if(!answerlist[0].value.trim()){
                alert("Cần nhập nội dung đáp án");
                answerlist.focus();
                ischeckAnwser= false;
                break; // dừng nếu không nó sẽ báo 4 lần nếu k nhập cái nào
            }
            
        }
        if(!isCheckRadio){
            return false
        }

        
       return true
    },
    deleteQuestion: function(divEl){
        const btnDelete = document.querySelectorAll('.deleteQuess')
        btnDelete.forEach(item => {
            item.addEventListener('click',() =>{
                divEl.remove()
            })
        })
    },
    start: function(){
        this.renderQuestion();
        this.handleAdd()
        this.handleSubmit();
    }
}
app.start();