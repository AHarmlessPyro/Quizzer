(this.webpackJsonpui_quizzer=this.webpackJsonpui_quizzer||[]).push([[0],[,,,,,function(e,t,n){e.exports=n.p+"static/media/logo_temp_1.c22650c3.png"},,,,function(e,t,n){e.exports=n(16)},,,,,function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var s=n(0),a=n.n(s),i=n(2),r=n.n(i),c=(n(14),n(3)),o=n(4),l=n(8),u=n(7),d=n(5),m=n.n(d),h=n(6),b=n.n(h),f=(n(15),function(e){return a.a.createElement("div",{className:"App"},a.a.createElement("header",{className:"App-header"},a.a.createElement("center",null,a.a.createElement("div",{className:"loginScreen borderStandard"},e.children),a.a.createElement("div",{className:"borderStandard",style:{color:"var(--base-color)"}},a.a.createElement("button",{onClick:function(){e.scoreFunction(),e.reverseVisibility()},className:"borderStandard"},"See Scores")))),a.a.createElement("div",{id:"scoreMenu",className:b()({inVisible:e.visibility,Visible:!e.visibility})},a.a.createElement("center",null,a.a.createElement("div",{style:{borderBottom:"1px solid var(--base-color)"}},a.a.createElement("button",{className:"borderStandard",style:{height:"35px"},onClick:function(){e.reverseVisibility()}}," Close this ")),a.a.createElement("table",{style:{width:"400px",height:"100%"}},a.a.createElement("tr",null,a.a.createElement("th",null,"Name"),a.a.createElement("th",null,"T1 Score"),a.a.createElement("th",null,"T2 Score"),a.a.createElement("th",null,"T3 Score")),e.scores&&e.scores.map((function(e){return a.a.createElement("tr",null,a.a.createElement("td",null,e.name),a.a.createElement("td",null,e.t1.score),a.a.createElement("td",null,e.t2.score),a.a.createElement("td",null,e.t3.score))}))))))}),v=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){var s;return Object(c.a)(this,n),(s=t.call(this,e)).inputNameOnChangeHandler=function(e){e.preventDefault(),s.setState({inputNameValue:e.target.value})},s.quizClickChangeHandler=function(e){e.preventDefault();var t=e.target.name;fetch("".concat(s.baseAddress,"/startTimer/").concat((new Date).getTime(),"/").concat(t,"/"),{method:"POST",credentials:"include"}).then((function(e){e.json().then((function(e){fetch("".concat(s.baseAddress,"/getQuestion/").concat(t,"/").concat(e.redirectTo),{credentials:"include"}).then((function(e){e.json().then((function(e){s.setState({currentQuestion:e.questions,notice:e.notice,maxCount:e.maxCount,currentQuiz:t,current:"quiz"})}))}))}))}))},s.answerButtonClickHandler=function(e){fetch("".concat(s.baseAddress,"/getQuestion/").concat(s.state.currentQuiz,"/").concat(s.state.currentQuestion.index,"/").concat(e.target.dataset.correct),{credentials:"include"}).then((function(e){e.json().then((function(e){s.setState({currentQuestion:e.questions,notice:e.notice,maxCount:e.maxCount})}))})),s.state.currentQuestion.index===s.state.maxCount&&fetch("".concat(s.baseAddress,"/endTimer/").concat((new Date).getTime(),"/").concat(s.state.currentQuiz),{method:"POST",credentials:"include"})},s.seeScores=function(e){e.preventDefault(),fetch("".concat(s.baseAddress,"/scores"),{credentials:"include"}).then((function(e){e.json().then((function(e){s.setState({scores:e})}))}))},s.backButtonClickHandler=function(e,t){e.preventDefault(),s.setState({current:"quiz selection"})},s.baseAddress="https://qui-zup.herokuapp.com",s.state={quizOptions:null,inputNameValue:null,currentQuiz:null,currentQuestion:null,notice:null,scores:null,scoresVisible:!0},s}return Object(o.a)(n,[{key:"componentDidMount",value:function(){var e=this;console.log("component mounting"),fetch("".concat(this.baseAddress,"/isUserRegistered"),{method:"GET",credentials:"include"}).then((function(t){t.json().then((function(t){t.reg?fetch("".concat(e.baseAddress,"/listOfQuizzes"),{credentials:"include"}).then((function(t){t.json().then((function(t){e.setState({current:"quiz selection",quizOptions:t})}))})):e.setState({current:"login"})}))}))}},{key:"login",value:function(){var e=this;null!==this.state.inputNameValue&&void 0!==this.state.inputNameValue&&fetch("".concat(this.baseAddress,"/registerUser/").concat(this.state.inputNameValue),{method:"POST",credentials:"include"}).then((function(t){fetch("".concat(e.baseAddress,"/listOfQuizzes"),{credentials:"include"}).then((function(t){t.json().then((function(t){e.setState({current:"quiz selection",quizOptions:t})}))}))}))}},{key:"reverseVisiblityScores",value:function(){console.log("running reversal"),!0===this.state.scoresVisible?this.setState({scoresVisible:!1}):this.setState({scoresVisible:!0})}},{key:"render",value:function(){var e=this;if("login"===this.state.current)return a.a.createElement(f,{scoreFunction:this.seeScores.bind(this),scores:this.state.scores,visibility:this.state.scoresVisible,reverseVisibility:this.reverseVisiblityScores.bind(this)},a.a.createElement("div",null,a.a.createElement("img",{className:"logoImg",src:m.a}),a.a.createElement("div",{className:"userName"},a.a.createElement("input",{type:"text",id:"inputName",placeholder:"Enter Your Name Here",className:"borderStandard",onChange:this.inputNameOnChangeHandler})),a.a.createElement("div",{className:"loginButtons"},a.a.createElement("button",{className:"borderStandard",onClick:this.login.bind(this)},"start quiz"),a.a.createElement("button",{className:"borderStandard",onClick:this.seeScores.bind(this)},"see scores"))));if("quiz selection"===this.state.current)return a.a.createElement(f,{scoreFunction:this.seeScores.bind(this),scores:this.state.scores,visibility:this.state.scoresVisible,reverseVisibility:this.reverseVisiblityScores.bind(this)},a.a.createElement("div",null,a.a.createElement("span",{className:"headerText"},"Select a Quiz :"),a.a.createElement("div",{className:"loginButtons"},this.state.quizOptions.map((function(t){return a.a.createElement("button",{onClick:e.quizClickChangeHandler,name:t.key,className:"borderStandard",key:t.key},t.name)})))));if("quiz"===this.state.current){var t=a.a.createElement("div",null,a.a.createElement("span",{className:"headerText"},this.state.currentQuestion.question),a.a.createElement("br",null),a.a.createElement("span",{className:"notice"},this.state.notice),a.a.createElement("div",{className:"loginButtons"},this.state.currentQuestion.answer.map((function(t,n){return a.a.createElement("button",{style:{paddingBottom:"30px",marginBottom:"30px"},onClick:e.answerButtonClickHandler.bind(e),name:n,"data-correct":n===e.state.currentQuestion.correct,className:"borderStandard",key:t},t)}))));return this.state.currentQuestion.index>this.state.maxCount&&(t=a.a.createElement("div",null,a.a.createElement("span",{className:"headerText"},"Quiz Done! Go back to quiz selection menu from the top button"))),a.a.createElement(f,{scoreFunction:this.seeScores.bind(this),scores:this.state.scores,visibility:this.state.scoresVisible,reverseVisibility:this.reverseVisiblityScores.bind(this)},a.a.createElement("div",null,a.a.createElement("div",{style:{marginBottom:"30px",borderBottom:"1px solid var(--base-color)"}},a.a.createElement("button",{className:"borderStandard",style:{height:"35px"},onClick:this.backButtonClickHandler.bind(this)},"Back To Quiz Selection")),t))}return a.a.createElement(f,{scoreFunction:this.seeScores.bind(this),scores:this.state.scores,visibility:this.state.scoresVisible,reverseVisibility:this.reverseVisiblityScores.bind(this)},a.a.createElement("div",{className:"header"},"We're loading Stuff. Either than or something went seriously wrong."))}}]),n}(a.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(a.a.createElement(a.a.StrictMode,null,a.a.createElement(v,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}],[[9,1,2]]]);
//# sourceMappingURL=main.2f9c5889.chunk.js.map