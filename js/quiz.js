let correct,
    score = (localStorage.getItem('quiz_correct') ? localStorage.getItem('quiz_correct') : 0),
    wrong = (localStorage.getItem('quiz-wrong')? localStorage.getItem('quiz-wrong') : 0);
document.addEventListener('DOMContentLoaded',function(){
    loadQues(ChooseCat());
    eventlistn();
});
function random(mn, mx) {  
   return Math.random() * (mx - mn) + mn;  
}  
eventlistn = ()=>{
    document.querySelector('#check-answer').addEventListener('click',validateAns);
    document.querySelector('#clear-storage').addEventListener('click',ClearRes);
}
ChooseCat = ()=>{
    let chose;
     fetch('https://opentdb.com/api_category.php')
    .then(data => data.json())
    .then(result => {
         let arrs = result["trivia_categories"];
         chose = arrs[Math.floor(random(1,arrs.length))-1]["id"];
         console.log(chose);
     });
    return chose;
}
//Loads questions from an API
loadQues = (cat) =>{
    fetch('https://opentdb.com/api.php?amount=1&category='+cat+'&type=multiple')
    .then(data => data.json())
    .then(result => displayResult(result.results));
}
//Display questions

displayResult = (questions) => {
    // let arr = [1,2,3];
    // let val = 4;
    // arr.splice(Math.floor(Math.random()*3),0,val)
    // add the element at random place
    // console.log(arr);
    //Create html
    const queshtml = document.createElement('div');
    queshtml.classList.add('col-12');
    questions.forEach(values =>{
        //Read the correct choice
        correct = values.correct_answer;
        //Add questions
        queshtml.innerHTML = '<div class="row justify-content-between heading"><p class="category"> Category'+
        values.category+
        '<div class="totals">'+
        '<span class= "badge badge-success">'+
        score+'</span>'+ '<span class= "badge badge-danger">'+
        wrong+'</span>'+
        '</div><h2 class="text-center">'+
        values.question+
        '</h2>';
        //Inject the answers
        let incorrect = values.incorrect_answers;
        incorrect.splice(Math.floor(Math.random()*3),0,correct);
        //Html for displaying front end
        const userAnswer = document.createElement('div');
        userAnswer.classList.add('questions','row','justify-content-around','mt-4')
        incorrect.forEach(answer => {
            const htmlofans = document.createElement('li');
            htmlofans.classList.add('col-12','col-md-5');
            htmlofans.textContent = answer;
            //Event for a click
            htmlofans.onclick = SelectAns;
            userAnswer.appendChild(htmlofans);
            
        });
        queshtml.appendChild(userAnswer);
        //introduce in HTML
        document.querySelector('#app').appendChild(queshtml);

    });
}
SelectAns = (event) => {
    //removes prev active
    if(document.querySelector('.active')){
        document.querySelector('.active').classList.remove('active');
    }
    //Selects the current answer
    event.target.classList.add('active');
}
validateAns = ()=>{
    if(document.querySelector('.questions .active')){
        //Check for right answer
        checkAns();
    }else{
        const err = document.createElement('div');
        err.classList.add('alert','alert-danger','col-md-6');
        err.textContent = 'Please Select One Answer!!!';
        //Insert the err into the html
        const divv = document.querySelector('.questions');
        divv.appendChild(err);

        //Remove after 3 seconds
        setTimeout(()=>{
            document.querySelector('.alert-danger').remove();
        },3000)
    }
}
checkAns = () =>{
    const userans = document.querySelector('.questions .active');
    if(correct === userans.textContent){
        score++;
    }else{
        wrong++;
    }
    //Save in local storage
    SaveinStroe();
    const app = document.querySelector('#app')
    while(app.firstChild){
        app.removeChild(app.firstChild);
    }
    //load a question
    loadQues(ChooseCat());
}
SaveinStroe = () => {
    localStorage.setItem('quiz_correct',score);
    localStorage.setItem('quiz-wrong',wrong);
}
//Clear Results i.e. restart
ClearRes = () => {
    localStorage.setItem('quiz_correct',0);
    localStorage.setItem('quiz-wrong',0);
    setTimeout(()=>{
        window.location.reload();
    },500)
}
