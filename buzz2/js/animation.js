let buzzScreen = bodymovin.loadAnimation({
  container: document.getElementById("buzzScreen"),
  path: "./json/buzzScreen.json",
  renderer: "svg",
  loop: false,
  autoplay: false,
});

let girlStage = bodymovin.loadAnimation({
  container: document.getElementById("girlStage"),
  path: "./json/mychar-girl.json",
  renderer: "svg",
  loop: false,
  autoplay: false,
});

let boyStage = bodymovin.loadAnimation({
  container: document.getElementById("boyStage"),
  path: "./json/boyStage.json",
  renderer: "svg",
  loop: false,
  autoplay: false,
});

let introStage = bodymovin.loadAnimation({
  container: document.getElementById("introStage"),
  path: "./json/intro.json",
  renderer: "svg",
  loop: false,
  autoplay: false,

});
// introStage.playSegments[0, 80,true];



let chooseAvatar = bodymovin.loadAnimation({
  container: document.getElementById("chooseAvatar"),
  path: "./json/chooseAvatar.json",
  renderer: "svg",
  loop: false,
  autoplay: false,
});
let boyVs = bodymovin.loadAnimation({
  container: document.getElementById("boyVs"),
  path: "./json/boy-vs.json",
  renderer: "svg",
  loop: false,
  autoplay: false,
});
let girlVs = bodymovin.loadAnimation({
  container: document.getElementById("girlVs"),
  path: "./json/girl-vs.json",
  renderer: "svg",
  loop: false,
  autoplay: false,
});

let BoyCharVs2 = bodymovin.loadAnimation({
  container: document.getElementById("BoyCharVs2"),
  path: "./json/boyv2.json",
  renderer: "svg",
  loop: false,
  autoplay: false,
});

let GirlCharVs = bodymovin.loadAnimation({
  container: document.getElementById("GirlCharVs"),
  path: "./json/girl-char-vs.json",
  renderer: "svg",
  loop: false,
  autoplay: false,
});
let BoyCharVs1 = bodymovin.loadAnimation({
  container: document.getElementById("BoyCharVs1"),
  path: "./json/BoyCharVs1.json",
  renderer: "svg",
  loop: false,
  autoplay: false,
});
let Timer = bodymovin.loadAnimation({
  container: document.getElementById("Timer"),
  path: "./json/timer.json",
  renderer: "svg",
  loop: false,
  autoplay: false,
});

let leftLight = bodymovin.loadAnimation({
  container: document.getElementById("leftLight"),
  path: "./json/leftLight.json",
  renderer: "svg",
  loop: false,
  autoplay: false,
});
let vsLight = bodymovin.loadAnimation({
  container: document.getElementById("vsLight"),
  path: "./json/vsLight.json",
  renderer: "svg",
  loop: false,
  autoplay: false,
});


let boyStageFeedback = bodymovin.loadAnimation({
  container: document.getElementById("boy"),
  path: "./json/boyStageFeedback.json",
  renderer: "svg",
  loop: false,
  autoplay: true,
});
let girlStageFeedback = bodymovin.loadAnimation({
  container: document.getElementById("girl"),
  path: "./json/girlStageFeedback.json",
  renderer: "svg",
  loop: false,
  autoplay: true,
});

let girlVsFeedback = bodymovin.loadAnimation({
  container: document.getElementById("computerGirl"),
  path: "./json/girlVsFeedback.json",
  renderer: "svg",
  loop: false,
  autoplay: true,
});
let boyVs2Feedback = bodymovin.loadAnimation({
  container: document.getElementById("computerBoy2"),
  path: "./json/boyVs2Feedback.json",
  renderer: "svg",
  loop: false,
  autoplay: true,
});
let boyVs1Feedback = bodymovin.loadAnimation({
  container: document.getElementById("computerBoy1"),
  path: "./json/boyVs1Feedback.json",
  renderer: "svg",
  loop: false,
  autoplay: true,
});
let festival = bodymovin.loadAnimation({
  container: document.getElementById("festival"),
  path: "./json/festival.json",
  renderer: "svg",
  loop: false,
  autoplay: true,
});
