import { getQuestionByIdQuiz, editQuestion } from "../services/api.js";
const app = {
    renderEditQuestion: async function(){
        var getAllQuestion = []
        const searchParam = new URLSearchParams(window.location.search);
        let id;
        if(searchParam.has("id")){
            id = searchParam.get('id')
        }
        const listEditQuestion = await getQuestionByIdQuiz(id);
        // console.log(listEditQuestion)
        document.getElementById("content").innerHTML =
        listEditQuestion?.map((item, index) => {
            const indexNew = index + 1
            // console.log(item) 
            const listAnswers = this.renderAnswers(item.answers, item.type, item.id, item.correctAnser)
           return `
           <div id= "form" class="question_item border border-2 rounded p-4 mb-2">
           <h4 class="question_number">Câu hỏi: ${indexNew} </h4>
                <div class="mb-3">
                    <label for="question_content_${indexNew}" class="form-label"></label>
                    <textarea class="form-control" name="question_1" id="question_content_${indexNew}" rows="3">${item.questionTiltle}</textarea>
                </div>
            
                 <div class="answer_items mt-3">
                    ${listAnswers}
                </div>
            </div>
                `
        }).join("")
       
        
    },
       
        renderAnswers: function(listAns, type, idQuestion, correctAnswers){
            // Duyệt qua mảng câu trả lời
            return listAns?.map((ans, index) => {
                 // Kiểm tra nếu câu trả lời đúng (có trong correctAnswers)
                const isChecked = correctAnswers.includes(ans.id.toString()) ? 'checked' : ''; // Chuyển ans.id thành chuỗi để so sánh
                return `
                        <div class="form-check fs-5 mb-3">
                            <input class="form-check-input border border-2 border-primary" role="button" type="${type == 1 ? 'radio' : 'checkbox'}" 
                            name="question_${idQuestion}" id="answer_${idQuestion}_${ans.id}" data-idQuestion = "${idQuestion}" data-idAnswer = "${ans.id}" ${isChecked}>
                            <label class="form-check-label" role="button" for="answer_${idQuestion}_${ans.id}">
                                ${ans.answerTitle}
                            </label>
                    </div>`
            }).join("")
        },
    
    handlerSubmitQuestion: async function(){
        const submitQuestion = document.getElementById("btn_submit");
        submitQuestion.addEventListener("click", async() =>{
        // console.log(getAllQuestion)
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
        
        if(data.length == listData.length){
            console.log(data)
            await editQuestion(data);
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

    start: function(){
        this.renderEditQuestion();
        this.handlerSubmitQuestion();
    }
}
app.start()