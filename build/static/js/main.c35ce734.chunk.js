(this.webpackJsonpui_quizzer=this.webpackJsonpui_quizzer||[]).push([[0],[,,,,,function(e,t,n){e.exports=n.p+"static/media/logo_temp_1.c22650c3.png"},,,function(e,t,n){e.exports=n(15)},,,,,function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var a=n(0),s=n.n(a),c=n(2),r=n.n(c),o=(n(13),n(3)),i=n(4),l=n(7),u=n(6),d=n(5),m=n.n(d),h=(n(14),function(e){return s.a.createElement("div",{className:"App"},s.a.createElement("header",{className:"App-header"},s.a.createElement("center",null,s.a.createElement("div",{className:"loginScreen borderStandard"},e.children),s.a.createElement("div",{className:"borderStandard",style:{color:"var(--base-color)"}},s.a.createElement("button",{onClick:e.scoreFunction,className:"borderStandard"},"See Scores")))),s.a.createElement("div",null,e.scores))}),f=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(o.a)(this,n),(a=t.call(this,e)).inputNameOnChangeHandler=function(e){e.preventDefault(),a.setState({inputNameValue:e.target.value})},a.quizClickChangeHandler=function(e){e.preventDefault();var t=e.target.name;fetch("".concat(a.baseAddress,"/startTimer/").concat((new Date).getTime(),"/").concat(t,"/"),{method:"POST",credentials:"include"}).then((function(e){e.json().then((function(e){fetch("".concat(a.baseAddress,"/getQuestion/").concat(t,"/").concat(e.redirectTo),{credentials:"include"}).then((function(e){e.json().then((function(e){a.setState({currentQuestion:e.questions,notice:e.notice,maxCount:e.maxCount,currentQuiz:t,current:"quiz"})}))}))}))}))},a.answerButtonClickHandler=function(e){console.log(e.target),fetch("".concat(a.baseAddress,"/getQuestion/").concat(a.state.currentQuiz,"/").concat(a.state.currentQuestion.index,"/").concat(e.target.dataset.correct),{credentials:"include"}).then((function(e){e.json().then((function(e){a.setState({currentQuestion:e.questions,notice:e.notice,maxCount:e.maxCount})}))})),a.state.currentQuestion.index===a.state.maxCount&&fetch("".concat(a.baseAddress,"/endTimer/").concat((new Date).getTime(),"/").concat(a.state.currentQuiz),{method:"POST",credentials:"include"})},a.seeScores=function(e){e.preventDefault(),fetch("".concat(a.baseAddress,"/scores"),{credentials:"include"}).then((function(e){e.json().then((function(e){a.setState({scores:e})}))}))},a.backButtonClickHandler=function(e,t){e.preventDefault(),a.setState({current:"quiz selection"})},a.baseAddress="http://127.0.0.1:3000",a.state={quizOptions:null,inputNameValue:null,currentQuiz:null,currentQuestion:null,notice:null,scores:null},a}return Object(i.a)(n,[{key:"componentDidMount",value:function(){var e=this;console.log("component mounting"),fetch("".concat(this.baseAddress,"/isUserRegistered"),{method:"GET",credentials:"include"}).then((function(t){t.json().then((function(t){console.log(t),t.reg?fetch("".concat(e.baseAddress,"/listOfQuizzes"),{credentials:"include"}).then((function(t){t.json().then((function(t){e.setState({current:"quiz selection",quizOptions:t})}))})):e.setState({current:"login"})}))}))}},{key:"login",value:function(){var e=this;null!==this.state.inputNameValue&&void 0!==this.state.inputNameValue&&fetch("".concat(this.baseAddress,"/registerUser/").concat(this.state.inputNameValue),{method:"POST",credentials:"include"}).then((function(t){console.log(t),fetch("".concat(e.baseAddress,"/listOfQuizzes"),{credentials:"include"}).then((function(t){t.json().then((function(t){e.setState({current:"quiz selection",quizOptions:t})}))}))}))}},{key:"render",value:function(){var e=this;if("login"===this.state.current)return s.a.createElement(h,{scoreFunction:this.seeScores.bind(this),scores:this.state.scores},s.a.createElement("div",null,s.a.createElement("img",{className:"logoImg",src:m.a}),s.a.createElement("div",{className:"userName"},s.a.createElement("input",{type:"text",id:"inputName",placeholder:"Enter Your Name Here",className:"borderStandard",onChange:this.inputNameOnChangeHandler})),s.a.createElement("div",{className:"loginButtons"},s.a.createElement("button",{className:"borderStandard",onClick:this.login.bind(this)},"start quiz"),s.a.createElement("button",{className:"borderStandard",onClick:this.seeScores.bind(this)},"see scores"))));if("quiz selection"===this.state.current)return s.a.createElement(h,{scoreFunction:this.seeScores.bind(this),scores:this.state.scores},s.a.createElement("div",null,s.a.createElement("span",{className:"headerText"},"Select a Quiz :"),s.a.createElement("div",{className:"loginButtons"},this.state.quizOptions.map((function(t){return s.a.createElement("button",{onClick:e.quizClickChangeHandler,name:t.key,className:"borderStandard",key:t.key},t.name)})))));if("quiz"===this.state.current){var t=s.a.createElement("div",null,s.a.createElement("span",{className:"headerText"},this.state.currentQuestion.question),s.a.createElement("br",null),s.a.createElement("span",{className:"notice"},this.state.notice),s.a.createElement("div",{className:"loginButtons"},this.state.currentQuestion.answer.map((function(t,n){return s.a.createElement("button",{style:{paddingBottom:"30px",marginBottom:"30px"},onClick:e.answerButtonClickHandler.bind(e),name:n,"data-correct":n===e.state.currentQuestion.correct,className:"borderStandard",key:t},t)}))));return this.state.currentQuestion.index>this.state.maxCount&&(t=s.a.createElement("div",null,s.a.createElement("span",{className:"headerText"},"Quiz Done! Go back to quiz selection menu from the top button"))),s.a.createElement(h,{scoreFunction:this.seeScores.bind(this),scores:this.state.scores},s.a.createElement("div",null,s.a.createElement("div",{style:{marginBottom:"30px",borderBottom:"1px solid var(--base-color)"}},s.a.createElement("button",{className:"borderStandard",style:{height:"35px"},onClick:this.backButtonClickHandler.bind(this)},"Back To Quiz Selection")),t))}return s.a.createElement(h,{scoreFunction:this.seeScores.bind(this),scores:this.state.scores},s.a.createElement("div",{className:"header"},"We're loading Stuff. Either than or something went seriously wrong."))}}]),n}(s.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(s.a.createElement(s.a.StrictMode,null,s.a.createElement(f,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}],[[8,1,2]]]);
//# sourceMappingURL=main.c35ce734.chunk.js.map