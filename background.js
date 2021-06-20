chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (msg.name == "fetchWords") {
    const apiKey = "pkgla1cgyi13s70exsqyd12y7qlaxieb59kkrxapdurhpqerk";
    const dateStr = new Date().toISOString().slice(0, 10);

    var storedDay = localStorage.getItem("dayFetch");
    var storedWord = localStorage.getItem("wordFetch");
    var storedDesc = localStorage.getItem("descFetch");
    if (dateStr == storedDay) {
      response({ word: storedWord, def: storedDesc });
    } else {
      const apiCall =
        "https://api.wordnik.com/v4/words.json/wordOfTheDay?date=" +
        dateStr +
        "&api_key=" +
        apiKey;
      console.log(apiCall);
      fetch(apiCall)
        .then(function (res) {
          if (res.status !== 200) {
            response({
              word: "Error",
              def: "There was a problem loading the word of the day",
            });
            return;
          }
          res.json().then(function (data) {
            localStorage.setItem("dayFetch", dateStr);
            localStorage.setItem("wordFetch", data.word);
            localStorage.setItem("descFetch", data.note);

            response({ word: data.word, def: data.note });
          });
        })
        .catch(function (err) {
          response({
            word: "Error",
            def: "There was a problem loading the word of the day",
          });
        });
    }
  }

  return true;
});
