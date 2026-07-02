const API_URL = "https://script.google.com/macros/s/AKfycbwaBShIUYJpAwyPZxyEUH2Ii-4tH9pP8dySPBuc4v0h9QYID-o_3lRK54yNv9Z_3-Ji/exec";

function apiJSONP(action, params = {}) {
  return new Promise((resolve, reject) => {
    const callbackName =
      "jsonp_callback_" + Date.now() + "_" + Math.floor(Math.random() * 10000);

    const script = document.createElement("script");

    window[callbackName] = function (data) {
      resolve(data);
      delete window[callbackName];
      script.remove();
    };

    const query = new URLSearchParams({
      action,
      callback: callbackName,
      ...params
    });

    script.src = API_URL + "?" + query.toString();

    script.onerror = function () {
      delete window[callbackName];
      script.remove();
      reject(new Error("เชื่อมต่อ Google Sheets ไม่สำเร็จ"));
    };

    document.body.appendChild(script);
  });
}

function getStudentsFromAPI() {
  return apiJSONP("getStudents");
}

function getQuestionsFromAPI() {
  return apiJSONP("getQuestions");
}

function saveScoreToAPI(scoreData) {
  return apiJSONP("saveScore", scoreData);
}
