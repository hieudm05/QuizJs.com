import { getAllQuiz } from "../services/api.js";
const app = {

    hanleChart: async function() {
        const quizData = await this.renderlistQuiz(); // Đợi kết quả từ API

        // Lấy các tiêu đề (hoặc bất cứ trường nào bạn muốn) để làm nhãn
        const labels = quizData.map(quiz => quiz.title || `Quiz ${quiz.id}`);
        
        // Lấy dữ liệu số lượng quiz đã làm
        const dataPoints = quizData.map(quiz => quiz.completed || 0); // Thay 'completed' bằng trường bạn cần

        // Dữ liệu cho biểu đồ
        const data = {
            labels: labels,
            datasets: [{
                label: 'Number of Quizzes Completed',
                data: dataPoints,  // Số lượng quiz đã làm
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        };

        // Cấu hình biểu đồ
        const config = {
            type: 'bar',  // Biểu đồ dạng cột
            data: data,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };

        // Vẽ biểu đồ
        const quizChart = new Chart(
            document.getElementById('quizChart'),
            config
        );
    },

    renderlistQuiz: async function() {
        try {
            // 1. Lấy danh sách quiz từ API
            const data = await getAllQuiz(); 
            
            // Đổ dữ liệu ra
            const listQuizz = data.map(item => ({
                id: item.id, 
                title: item.title,  
                completed: item.time  
            }));
            
            return listQuizz;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách quiz:', error);
            return []; 
        }
    },

    start: function() {
        this.hanleChart();
    }
};

app.start();
