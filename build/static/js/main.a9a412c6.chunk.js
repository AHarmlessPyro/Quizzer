(this.webpackJsonpui_quizzer=this.webpackJsonpui_quizzer||[]).push([[0],[,,,,,function(e,t,n){e.exports=n.p+"static/media/logo_temp_1.c22650c3.png"},,,function(e,t,n){e.exports=n(15)},,,,,function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var a=n(0),s=n.n(a),r=n(2),c=n.n(r),i=(n(13),n(3)),o=n(4),l=n(7),u=n(6),d=n(5),m=n.n(d),h=(n(14),function(e){return s.a.createElement("div",{className:"App"},s.a.createElement("header",{className:"App-header"},s.a.createElement("center",null,s.a.createElement("div",{className:"loginScreen borderStandard"},e.children),s.a.createElement("div",{className:"borderStandard",style:{color:"var(--base-color)"}},s.a.createElement("button",{onClick:e.scoreFunction,className:"borderStandard"},"See Scores")))),s.a.createElement("div",{id:"scoreMenu",style:{position:"fixed",width:"100%",top:"0%",display:e.visibility,textAlign:"center"}},s.a.createElement("div",{style:{marginBottom:"30px",borderBottom:"1px solid var(--base-color)"}},s.a.createElement("button",{className:"borderStandard",style:{height:"35px"},onClick:function(t){e.reverseVisible()}},"Close this")),s.a.createElement("table",{style:{width:"400px",height:"500px"}},s.a.createElement("tr",null,s.a.createElement("th",null,"Name"),s.a.createElement("th",null,"T1 Score"),s.a.createElement("th",null,"T2 Score"),s.a.createElement("th",null,"T3 Score")),e.scores&&e.scores.map((function(e){return s.a.createElement("tr",null,s.a.createElement("td",null,e.name),s.a.createElement("td",null,e.t1.score),s.a.createElement("td",null,e.t2.score),s.a.createElement("td",null,e.t3.score))})))))}),b=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(i.a)(this,n),(a=t.call(this,e)).inputNameOnChangeHandler=function(e){e.preventDefault(),a.setState({inputNameValue:e.target.value})},a.quizClickChangeHandler=function(e){e.preventDefault();var t=e.target.name;fetch("".concat(a.baseAddress,"/startTimer/").concat((new Date).getTime(),"/").concat(t,"/"),{method:"POST",credentials:"include"}).then((function(e){e.json().then((function(e){fetch("".concat(a.baseAddress,"/getQuestion/").concat(t,"/").concat(e.redirectTo),{credentials:"include"}).then((function(e){e.json().then((function(e){a.setState({currentQuestion:e.questions,notice:e.notice,maxCount:e.maxCount,currentQuiz:t,current:"quiz"})}))}))}))}))},a.answerButtonClickHandler=function(e){fetch("".concat(a.baseAddress,"/getQuestion/").concat(a.state.currentQuiz,"/").concat(a.state.currentQuestion.index,"/").concat(e.target.dataset.correct),{credentials:"include"}).then((function(e){e.json().then((function(e){a.setState({currentQuestion:e.questions,notice:e.notice,maxCount:e.maxCount})}))})),a.state.currentQuestion.index===a.state.maxCount&&fetch("".concat(a.baseAddress,"/endTimer/").concat((new Date).getTime(),"/").concat(a.state.currentQuiz),{method:"POST",credentials:"include"})},a.seeScores=function(e){e.preventDefault(),fetch("".concat(a.baseAddress,"/scores"),{credentials:"include"}).then((function(e){e.json().then((function(e){a.setState({scores:e})}))}))},a.backButtonClickHandler=function(e,t){e.preventDefault(),a.setState({current:"quiz selection"})},a.baseAddress="https://qui-zup.herokuapp.com",a.state={quizOptions:null,inputNameValue:null,currentQuiz:null,currentQuestion:null,notice:null,scores:null,scoresVisibile:"none"},a}return Object(o.a)(n,[{key:"componentDidMount",value:function(){var e=this;console.log("component mounting"),fetch("".concat(this.baseAddress,"/isUserRegistered"),{method:"GET",credentials:"include"}).then((function(t){t.json().then((function(t){t.reg?fetch("".concat(e.baseAddress,"/listOfQuizzes"),{credentials:"include"}).then((function(t){t.json().then((function(t){e.setState({current:"quiz selection",quizOptions:t})}))})):e.setState({current:"login"})}))}))}},{key:"login",value:function(){var e=this;null!==this.state.inputNameValue&&void 0!==this.state.inputNameValue&&fetch("".concat(this.baseAddress,"/registerUser/").concat(this.state.inputNameValue),{method:"POST",credentials:"include"}).then((function(t){fetch("".concat(e.baseAddress,"/listOfQuizzes"),{credentials:"include"}).then((function(t){t.json().then((function(t){e.setState({current:"quiz selection",quizOptions:t})}))}))}))}},{key:"reverseVisiblityScores",value:function(){console.log("running reversal"),"none"===this.state.scoresVisible?this.setState({scoresVisible:""}):this.setState({scoresVisible:"none"})}},{key:"render",value:function(){var e=this;if("login"===this.state.current)return s.a.createElement(h,{scoreFunction:this.seeScores.bind(this),scores:this.state.scores},s.a.createElement("div",null,s.a.createElement("img",{className:"logoImg",src:m.a}),s.a.createElement("div",{className:"userName"},s.a.createElement("input",{type:"text",id:"inputName",placeholder:"Enter Your Name Here",className:"borderStandard",onChange:this.inputNameOnChangeHandler})),s.a.createElement("div",{className:"loginButtons"},s.a.createElement("button",{className:"borderStandard",onClick:this.login.bind(this)},"start quiz"),s.a.createElement("button",{className:"borderStandard",onClick:this.seeScores.bind(this)},"see scores"))));if("quiz selection"===this.state.current)return s.a.createElement(h,{scoreFunction:this.seeScores.bind(this),scores:this.state.scores},s.a.createElement("div",null,s.a.createElement("span",{className:"headerText"},"Select a Quiz :"),s.a.createElement("div",{className:"loginButtons"},this.state.quizOptions.map((function(t){return s.a.createElement("button",{onClick:e.quizClickChangeHandler,name:t.key,className:"borderStandard",key:t.key},t.name)})))));if("quiz"===this.state.current){var t=s.a.createElement("div",null,s.a.createElement("span",{className:"headerText"},this.state.currentQuestion.question),s.a.createElement("br",null),s.a.createElement("span",{className:"notice"},this.state.notice),s.a.createElement("div",{className:"loginButtons"},this.state.currentQuestion.answer.map((function(t,n){return s.a.createElement("button",{style:{paddingBottom:"30px",marginBottom:"30px"},onClick:e.answerButtonClickHandler.bind(e),name:n,"data-correct":n===e.state.currentQuestion.correct,className:"borderStandard",key:t},t)}))));return this.state.currentQuestion.index>this.state.maxCount&&(t=s.a.createElement("div",null,s.a.createElement("span",{className:"headerText"},"Quiz Done! Go back to quiz selection menu from the top button"))),s.a.createElement(h,{scoreFunction:this.seeScores.bind(this),scores:this.state.scores},s.a.createElement("div",null,s.a.createElement("div",{style:{marginBottom:"30px",borderBottom:"1px solid var(--base-color)"}},s.a.createElement("button",{className:"borderStandard",style:{height:"35px"},onClick:this.backButtonClickHandler.bind(this)},"Back To Quiz Selection")),t))}return s.a.createElement(h,{scoreFunction:this.seeScores.bind(this),scores:this.state.scores,visibility:this.state.scoresVisible,reverseVisible:this.reverseVisiblityScores.bind(this)},s.a.createElement("div",{className:"header"},"We're loading Stuff. Either than or something went seriously wrong."))}}]),n}(s.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(s.a.createElement(s.a.StrictMode,null,s.a.createElement(b,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}],[[8,1,2]]]);
//# sourceMappingURL=main.a9a412c6.chunk.js.map