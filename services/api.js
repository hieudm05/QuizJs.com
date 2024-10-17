export const getAllQuiz = async () =>{
    try {
        // call api lấy danh sách quiz
        const res = await fetch('http://localhost:3000/quizs');
        const data = await res.json();
        return data;
    } catch (error) {
        alert("lỗi")
    }
}

export const getQuestionByIdQuiz = async(idQuiz) =>{
    // call api
   try {
        const res = await fetch(`http://localhost:3000/questions?quizId=${idQuiz}`);
        const data = await res.json();
        return data;
   } catch (error) {
        alert("Lỗi");
   }
}
export const getQuestionByIdQuizEdit = async(idQuiz) =>{
    // call api
   try {
        const res = await fetch(`http://localhost:3000/questions/${idQuiz}`);
        const data = await res.json();
        return data;
   } catch (error) {
        alert("Lỗi");
   }
}

export const getQuizById = async (id) =>{
    try {
        // trả về 1 object chứa id theo điều kiện
        const res = await fetch(`http://localhost:3000/quizs/${id}`)
        const data = await res.json();
        return data
    } catch (error) {
        alert(error)
    }
}

export const addQuizz = async (data) =>{
    try {
        const res = await fetch('http://localhost:3000/quizs',{
            method: "post",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // Chuyển dữ liệu từ obj về json
        });
        
        const dataRes = await res.json()
        return dataRes
    } catch (error) {
        alert("Lỗi")
    }
}
export const addQuestions = async (datas) =>{
    try {
        datas.forEach( async (item) => {
         await fetch('http://localhost:3000/questions',{
                method: "post",
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item) // Chuyển dữ liệu từ obj về json
            });
            
        });
        const dataRes = await res.json()
        return dataRes
    } catch (error) {
        alert("Lỗi")
    }
}
export const deleteQuiz = async (id) => {
    try {
        await fetch(`http://localhost:3000/quizs/${id}`,{
            method: "delete"
        })
    } catch (error) {
        alert(error)
    }
}
export const editQuizz = async (id,data) =>{
    try {
        await fetch(`http://localhost:3000/quizs/${id}`,{
            method: "put",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // Chuyển dữ liệu từ obj về json
        });
        
    } catch (error) {
        alert("Lỗi")
    }
}

// Sửa question
export const editQuestion = async (id,datas) =>{
    try {
        datas.forEach( async (item) => {
         await fetch(`http://localhost:3000/questions/${id}`,{
                method: "put",
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item) // Chuyển dữ liệu từ obj về json
            });
            
        });
        const dataRes = await res.json()
        return dataRes
    } catch (error) {
        alert("Lỗi")
    }
}




