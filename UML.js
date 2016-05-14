var s;

window.onload = function () {
    var examinationTime = 100;//100分钟是答卷的总时间
    var interval = 1000;//
    var endDate = cutoff(examinationTime);//endDate是答卷终止时间

    s = window.setInterval(function () {
        calculationDeadlin(endDate);
    }, interval);//每隔1s执行一次

    var submit = document.getElementById("submit");
    submit.onclick = function () {
        controlsDown();
    };
};

function stop(s) {//关闭定时器
    clearTimeout(s);
}

function cutoff(minites) {//计算最长的答卷时间,返回Date型...
    var nowDate = new Date();
    nowDate.setTime(nowDate.getTime() + minites * 60 * 1000);
    return nowDate;
}

function controlsDown() {
    var message = confirm("确认提交吗?");

    if (message === true) {
        //if (!mandatory()) {//检查姓名,班级,学号是否填写
        //    alert("Please complete information");
        //    return false;
        //}
        calculateScore();
    }
}
function calculationDeadlin(endDate) {
    var now = new Date();
    var leftTime = endDate.getTime() - now.getTime();
    var leftSecond = parseInt(leftTime / 1000);//得到秒

    var minute = Math.floor(leftSecond / 60);
    var second = Math.floor(leftSecond - minute * 60);
    $("#deadline").html("剩余时间:" + minute + "分" + second + "秒");

    if (minute === 0 && second === 0) {
        calculateScore();
    }
}

function calculateScore() {//计算总分
    stop(s);
    var totalScore = addTotalScore();
    alert("你的总分为:" + totalScore);
    $("#totalScore").html("得分:" + totalScore);
}

function addTotalScore() {//将所有大题的分数相加
    var name = loadAllName();
    var answers = loadAllAnswers();

    return (getScoresFirstAndFifth(name[0], answers[0]) * 5) +
        (getScoresSecondAndFourth(name[1], answers[1]) * 10) +
        (getScoresThird(name[2], answers[2]) * 10) +
        (getScoresSecondAndFourth(name[3], answers[3]) * 10) +
        (getScoresFirstAndFifth(name[4], answers[4]) * 20);
}

function getScoresThird(smalllNames, answer) {//统计第三道大题做对的题目数
    var flag = 0;

    for (var i = 0; i < smalllNames.length; i++) {
        if (getAMultipleChoice(smalllNames[i], answer[i]) === returnLength(smalllNames[i])) {//判断改题是否正确.
            flag++;
        }
    }

    return flag;
}

function getAMultipleChoice(smalllName, answer) {
    var numberCorrect = 0;

    for (var j = 0; j < returnLength(smalllName); j++) {
        if (select(smalllName, j)) {//选中,并且选对了
            if (isEqual(returnValue(smalllName, j), answer)) {
                numberCorrect++;
            }
        }
        else if (!isEqual(returnValue(smalllName, j), answer)) {//没选中,并且对了
            numberCorrect++;
        }
    }

    return numberCorrect;
}

function isEqual(smalllName, smallAnswers) {//选择题,所选的按钮与答案对比,判断是否正确
    for (var i = 0; i < smallAnswers.length; i++) {
        if (smalllName === smallAnswers[i]) {
            return true;
        }
    }
}

function getScoresSecondAndFourth(smalllNames, answer) {//统计第二道大题(或第四道大题)做对的题目数
    var flag = 0;

    for (var j = 0; j < smalllNames.length; j++) {
        flag += haveEqual(smalllNames[j], answer[j]);
    }

    return flag;
}

function haveEqual(smalllName, answer) {//统计单选题或判断题做对的题数
    var numberCorrect = 0;

    for (var i = 0; i < returnLength(smalllName); i++) {
        if (select(smalllName, i) && (returnValue(smalllName, i) === answer)) {
            numberCorrect++;
        }
    }

    return numberCorrect;
}

function getScoresFirstAndFifth(smallName, answer) {//统计第一道大题(或第五道大题)做对的题目数
    var flag = 0;

    for (var i = 0; i < returnLength(smallName); i++) {
        if (returnValue(smallName, i) === answer[i]) {
            flag++;
        }
    }

    return flag;
}

function returnValue(name, index) {//返回按钮的value值
    return document.getElementsByName(name)[index].value;
}

function returnLength(name) {//返回长度
    return document.getElementsByName(name).length;
}

function select(button, index) {//按钮是否选中
    return document.getElementsByName(button)[index].checked;
}

function loadAllName() {//返回所有题目的name值
    return {
        0: ["blank"],
        1: ["relationship", "languageSupport"],
        2: ["granularity", "composition"],
        3: ["judge1", "judge2"],
        4: ["manifestations"]
    }
}

function loadAllAnswers() {//所有的正确答案
    return {
        0: ["统一建模语言", "封装性", "继承性", "多态性"],
        1: ["B", "A"],
        2: {0: ["A", "B", "D"], 1: ["A", "B", "C"]},
        3: ["false", "true"],
        4: ["模型是对现实世界的简化和抽象,模型是对所研究的系统、过程、事物或概念的一种表达形式。可以是物理实体;可以是某种图形;或者是一种数学表达式。"]
    }
}

function mandatory() {   //检查姓名,班级,学号是否填写
    if ($("#userClass").val() && $("#userName").val() && $("#userId").val()) {
        return true;
    }
}