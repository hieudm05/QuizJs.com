import { getQuizById, getQuestionByIdQuiz } from "../services/api.js";
var listQuestion = [];
var listAnswerSubmit = [];
var btnSubmit = document.getElementById("btn_submit");
var isSubmit = false;
var startTime = Date.now(); // Đếm thời gian làm bài
var timeEL = document.getElementById("timer")
const app = {
    getQuizandQuestion: async function(){
    // Lấy id trên url
    const searchParam = new URLSearchParams(window.location.search);
    // console.log(searchParam)
    // Kiểm tra id 
        if(searchParam.has('id')){
            const id = searchParam.get('id');
            // Lấy dữ liệu quizz theo id của quizz
            const dataQuiz = await getQuizById(id);
            // Đếm ngược thời gian
            this.countDown(dataQuiz.time);

            startTime = Date.now();  // Ghi lại thời gian bắt đầu
            this.renderQuiInfo(dataQuiz) // Giao diện Quizzz
            //Thông tin của question
            listQuestion = await getQuestionByIdQuiz(id);
            // console.log(listQuestion);
            this.renderListQuestion(listQuestion);
        }
    },
    // Tráo đổi thứ tự
    random: function(array){
        return array.sort(() => Math.random() - Math.random());
    },
    // Đổ ra giao diện
    renderQuiInfo: function(data){
        document.getElementById("quiz_heading").innerHTML = data.title;
        document.getElementById("quiz_description").innerHTML = data.description;
    },
    renderListQuestion: function(list){
        list = this.random(list)
        const questionItem = list?.map((item, index) => {
            const listAnswers = this.renderAnswers(item.answers, item.type, item.id)
            return `<div class="question_item border border-2 rounded p-4 mb-2">
                <h4 class="question_number" id="${item.id}">Câu hỏi: ${index +1}</h4>
                <h5 class="question_title">
                    ${item.questionTiltle}
                </h5>
                <div class="answer_items mt-3">
                ${listAnswers}
                </div>
            </div>`
        }).join("");
        document.getElementById("question_container").innerHTML = questionItem
    },
    renderAnswers: function(listAns, type, idQuestion){
        listAns = this.random(listAns);
        // Duyệt qua mảng câu trả lời
        return listAns?.map((ans, index) => {
            return `
                    <div class="form-check fs-5 mb-3">
                        <input class="form-check-input border border-2 border-primary" role="button" type="${type == 1 ? 'radio' : 'checkbox'}" 
                        name="question_${idQuestion}" id="answer_${idQuestion}_${ans.id}" data-idQuestion = "${idQuestion}" data-idAnswer = "${ans.id}">
                        <label class="form-check-label" role="button" for="answer_${idQuestion}_${ans.id}">
                            ${ans.answerTitle}
                        </label>
                </div>`
        }).join("")
    },

    // Nộp bài
    handleSubmit: function(){
        const btnSubmit = document.getElementById("btn_submit");
        btnSubmit.addEventListener("click", () =>{
            if(confirm("Bạn có chắc chắn nộp bài không?")){
                this.handleSubmitForm();
            }
        })
    },
    handleSubmitForm: function(){
        btnSubmit.disabled = true; // Vô hiệu hoá nút nộp bài sau khi đã ấn nộp bài
        btnSubmit.innerHTML = "Đã nộp bài";
        var endTime = Date.now();  // Thời gian kết thúc
        var timeTaken = Math.floor((endTime - startTime) / 1000);  // Tính thời gian làm bài theo giây
        const inputAll = document.querySelectorAll('input');
                inputAll.forEach((item) =>{
                    item.addEventListener('click', (e) =>{
                        e.preventDefault()
                    })
                })
                isSubmit = true;
                // Lấy ra đáp án mà người dùng lựa chọn
                //1. Lấy tất cả câu trả lời theo từng câu hỏi
                const listAnsUser = document.querySelectorAll(".answer_items");
                //2. Duyệt qua từng nhóm câu trả lời
                listAnsUser?.forEach((anss) => {
                    const data = {
                        idQuestion: "",
                        idAnss: []
                    }
                    const inputs = anss.querySelectorAll('input')
                    // Duyệt mảng các câu trả lời
                    inputs?.forEach((ans) =>{
                        if(ans.checked){
                            // console.log(ans)
                            data.idQuestion = ans.getAttribute("data-idQuestion");
                            data.idAnss.push(ans.getAttribute("data-idAnswer"))
                        }
                    })
                    // nếu data có id câu trả lời và có câu trả lời(length)
                    if(data.idAnss && data.idAnss.length) {
                        listAnswerSubmit.push(data);
                    }
                });
                // console.log(listAnswerSubmit);
                this.checkAns(listAnswerSubmit, timeTaken)
    },
    //Kiểm tra đáp án
    checkAns: function(listAnswerSubmit,  timeTaken){
        // Lưu trữ câu trả lời
        const checkResult = [];
        console.log(listAnswerSubmit);
        console.log(listQuestion); 
        // Duyệt qua các đáp án mà người dùng lựa chọn
        const listStatus = [];
        let countRight = 0;
        listAnswerSubmit.forEach((ansUser) =>{
            //Tìm câu hỏi có đáp án trog mảng listQuestion
            const findQuestion = listQuestion.find((ques) =>{
                return ques.id === ansUser.idQuestion
            })
            // So sánh giá trị của 2 mảng
            const isCheck = this.checkEqual(ansUser.idAnss,findQuestion.correctAnser );
            // Lưu trữ câu trả lời
            if(isCheck){
                // Nếu đúng tăng count lên 1
                countRight++;
            }
            listStatus.push({
                idQuestion: findQuestion.id,
                status: isCheck
            })
        })
        const sumQuestion = listQuestion.length
        alert(`Bạn đã trả lời đúng ${countRight}/${sumQuestion} câu hỏi`);
        // Yêu cầu điền thông tin
        this.inforUser(countRight, timeTaken);  // Truyền thời gian
        this.renderStatus(listStatus)

        // console.log(listStatus)
        
    },
    // Thời gian làm bài
    
    inforUser: function(countRight, timeTaken){
        timeEL.innerHTML = "";
        const minutes = Math.floor(timeTaken / 60);
        const seconds = timeTaken % 60;
        const formattedTime = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        const content = document.getElementById('content');
        // console.log(content);
        
        content.innerHTML = ` <div class="container mt-5">
        <h2 class="text-center">Bạn đã hoàn thành Quiz!</h2>
        <p class="text-center">Vui lòng điền thông tin để lưu kết quả của bạn.</p>

        <form id="quizForm">
            <div class="form-group">
                <label for="name">Tên của bạn</label>
                <input type="text" class="form-control" id="name" placeholder="Nhập tên của bạn" required>
            </div>
            <div class="form-group">
                <label for="score">Điểm số</label>
                <input type="text" class="form-control" id="score" value="${countRight}" readonly>
            </div>
            <div class="form-group">
                <label for="time">Thời gian hoàn thành</label>
                <input type="text" class="form-control" id="time" value="${formattedTime}" readonly>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Gửi thông tin</button>
        </form>
    </div>`
        
    },
    checkEqual: function(arr1, arr2){
        // Sắp xếp thứ tự tăng dần
        if(arr1.length != arr2.length){
            return false
        }
        arr1 = arr1.sort();
        arr2 = arr2.sort();
        // Check đáp án

        for (let i = 0; i < arr1.length; i++) {
            if(arr1[i] != arr2[i]){
                return false
            }
        }
        return true

    },
    renderStatus: function(listStatus){
        listStatus?.forEach((item) =>{
            const title = document.getElementById(item.idQuestion)
            title.innerHTML = `${title.textContent} ${item.status ? '<span class="badge text-bg-success">Đúng</span>' : '<span class="badge text-bg-danger">Sai</span>'}`
        })
    },
    countDown: function(time){
        let that = this // sửa lỗi phạm vi
        function handleTime (){
                // Đổi giây sang phút
            const minute = Math.floor(time / 60)
            const second = time % 60
            // Lấy id của timer
            timeEL.innerHTML = `${minute < 10 ? "0" : ""}${minute}
            :
            ${second < 10 ? "0":""}${second}`;
            time--; // giảm thời gian sau 1 giây
            if(isSubmit){
                clearInterval(timeInter);
            }
            if(time < 0){
                // submit
                that.handleSubmitForm();
                clearInterval(timeInter);
                timeEL.innerHTML = `Hết giờ`;
                 
            }
            
        }
        const timeInter = setInterval(handleTime,1000)
    },
    // Làm lại
    reset: function(){
        const resetBtn = document.getElementById("btn_reset");
        resetBtn.addEventListener("click",()=>{
            if(window.confirm("Bạn chắc chắn muốn làm lại không?")){
                window.location.reload();
            }
        })
    },

    ///////////

    
    // Chạy
    start: function(){
        this.reset()
        this.getQuizandQuestion();
        this.handleSubmit();
    }
}
app.start();