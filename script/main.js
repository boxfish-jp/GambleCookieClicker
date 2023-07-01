const resolvePlayerInfo =
    require("@akashic-extension/resolve-player-info").resolvePlayerInfo;

let gambleTime = false; // 賭け中かどうか
let resultPending = false; // 結果待ちかどうか
// 参加者の情報を保持するテーブル
let playersTable = {};
let firstGamble = true; // 初回賭けかどうか
let updateAllow = true; // 更新を許可するかどうか
let choiceNum = 0; // 賭けの選択肢の数

// 放送者のみ表示

// 賭けの設定ができる
function streamer(scene, font, streamerLayer, playersTable) {
    /*  賭けの枚数の合計は現在非表示にしています。
    let scoreSum = new g.Label({
        scene: scene,
        font: font,
        parent: streamerLayer,
        text: "総スコア数0個",
        anchorX: 0.5,
        anchorY: 0.5,
        fontSize: 20,
        textColor: "#593018",
        x: 500,
        y: 470,
        scaleX: 1,
        scaleY: 1,
        touchable: true,
        local: true,
    });
    */
    let choiceIndi = new g.Label({
        scene: scene,
        font: font,
        parent: streamerLayer,
        text: "選択中",
        anchorX: 0.5,
        anchorY: 0.5,
        fontSize: 25,
        textColor: "#593018",
        x: 500,
        y: 520,
        scaleX: 1,
        scaleY: 1,
        touchable: true,
        local: true,
    });
    let explain = new g.Label({
        scene: scene,
        font: font,
        parent: streamerLayer,
        text: "賭けを始めるには,下のボタンで何択の賭けをするか入力して、「賭けを始める」ボタンを押してください",
        fontSize: 25,
        textColor: "#593018",
        anchorX: 0.5,
        anchorY: 0.5,
        x: 640,
        y: 570,
    });
    let choiceNum1 = new g.Sprite({
        scene: scene,
        parent: streamerLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 200,
        y: 640,
        scaleX: 0.15,
        scaleY: 0.15,
        opacity: 0,
        src: scene.asset.getImageById("key1"),
        touchable: false,
        local: true,
    });
    let choiceNum2 = new g.Sprite({
        scene: scene,
        parent: streamerLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 300,
        y: 640,
        scaleX: 0.15,
        scaleY: 0.15,
        src: scene.asset.getImageById("key2"),
        touchable: true,
        local: true,
    });
    let choiceNum3 = new g.Sprite({
        scene: scene,
        parent: streamerLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 400,
        y: 640,
        scaleX: 0.15,
        scaleY: 0.15,
        src: scene.asset.getImageById("key3"),
        touchable: true,
        local: true,
    });
    let choiceNum4 = new g.Sprite({
        scene: scene,
        parent: streamerLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 500,
        y: 640,
        scaleX: 0.15,
        scaleY: 0.15,
        src: scene.asset.getImageById("key4"),
        touchable: true,
        local: true,
    });
    let choiceNum5 = new g.Sprite({
        scene: scene,
        parent: streamerLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 600,
        y: 640,
        scaleX: 0.15,
        scaleY: 0.15,
        src: scene.asset.getImageById("key5"),
        touchable: true,
        local: true,
    });
    let choiceNum6 = new g.Sprite({
        scene: scene,
        parent: streamerLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 700,
        y: 640,
        scaleX: 0.15,
        scaleY: 0.15,
        src: scene.asset.getImageById("key6"),
        touchable: true,
        local: true,
    });
    let choiceNum7 = new g.Sprite({
        scene: scene,
        parent: streamerLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 800,
        y: 640,
        scaleX: 0.15,
        scaleY: 0.15,
        src: scene.asset.getImageById("key7"),
        touchable: true,
        local: true,
    });
    let choiceNum8 = new g.Sprite({
        scene: scene,
        parent: streamerLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 900,
        y: 640,
        scaleX: 0.15,
        scaleY: 0.15,
        src: scene.asset.getImageById("key8"),
        touchable: true,
        local: true,
    });
    let choiceNum9 = new g.Sprite({
        scene: scene,
        parent: streamerLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 1000,
        y: 640,
        scaleX: 0.15,
        scaleY: 0.15,
        src: scene.asset.getImageById("key9"),
        touchable: true,
        local: true,
    });

    let startGamble = new g.Sprite({
        scene: scene,
        parent: streamerLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 700,
        y: 250,
        scaleX: 1,
        scaleY: 1,
        src: scene.asset.getImageById("startGamble"),
        touchable: true,
        local: true,
    });
    let closeGamble = new g.Sprite({
        scene: scene,
        parent: streamerLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 700,
        y: 300,
        scaleX: 1,
        scaleY: 1,
        opacity: 0,
        src: scene.asset.getImageById("close"),
        touchable: false,
        local: true,
    });

    let close;
    scene.onUpdate.add(function () {
        /*
        let totalScore = 0;
        for (const key in playersTable) {
            if (playersTable.hasOwnProperty(key)) {
                totalScore += playersTable[key].score;
            }
        }
        scoreSum.text = "総クッキー数" + totalScore.toString() + "個";
        scoreSum.invalidate();
        */
        if (gambleTime) {
            startGamble.touchable = false;
            startGamble.opacity = 0;
            startGamble.modified();
        } else {
            startGamble.touchable = true;
            startGamble.opacity = 1;
            startGamble.modified();
        }
        if (gambleTime && !resultPending) {
            // すべてのchoiceNumを非表示にする
            for (let i = 1; i <= 9; i++) {
                const element = eval("choiceNum" + i.toString());
                element.touchable = false;
                element.opacity = 0;
                element.modified();
            }
            closeGamble.touchable = true;
            closeGamble.opacity = 1;
            closeGamble.modified();
            explain.text =
                "投票を締め切るには、「賭けを締め切る」ボタンを押しましょう";
            explain.invalidate();
        }
    });
    function choiceSelect(num) {
        if (!gambleTime) {
            choiceNum = num;
            choiceIndi.text = choiceNum.toString() + "択の賭けを始める";
            choiceIndi.invalidate();
        } else if (resultPending) {
            resultPending = false;
            g.game.raiseEvent(new g.MessageEvent({ result: num }));
            gambleTime = false;
            explain.text =
                "賭けを始めるには,下のボタンで何択の賭けをするか入力して、「賭けを始める」ボタンを押してください";
            explain.invalidate();
            choiceNum1.touchable = false;
            choiceNum1.opacity = 0;
            choiceNum1.modified();
            // 選択肢ボタンの再表示
            for (let i = 2; i <= 9; i++) {
                const element = eval("choiceNum" + i.toString());
                element.touchable = true;
                element.opacity = 1;
                element.modified();
            }
        }
        //console.log("resultPending", resultPending);
    }
    choiceNum1.onPointDown.add(function () {
        choiceSelect(1);
    });
    choiceNum2.onPointDown.add(function () {
        choiceSelect(2);
    });
    choiceNum3.onPointDown.add(function () {
        choiceSelect(3);
    });
    choiceNum4.onPointDown.add(function () {
        choiceSelect(4);
    });
    choiceNum5.onPointDown.add(function () {
        choiceSelect(5);
    });
    choiceNum6.onPointDown.add(function () {
        choiceSelect(6);
    });
    choiceNum7.onPointDown.add(function () {
        choiceSelect(7);
    });
    choiceNum8.onPointDown.add(function () {
        choiceSelect(8);
    });
    choiceNum9.onPointDown.add(function () {
        choiceSelect(9);
    });
    startGamble.onPointDown.add(function () {
        if (!choiceNum) return;
        g.game.raiseEvent(
            new g.MessageEvent({ startGamble: true, choiceNum: choiceNum })
        );
    });
    closeGamble.onPointDown.add(function () {
        // 正解の選択肢ボタンを表示する
        for (let i = 1; i <= choiceNum; i++) {
            const element = eval("choiceNum" + i.toString());
            element.touchable = true;
            element.opacity = 1;
            element.modified();
        }
        g.game.raiseEvent(new g.MessageEvent({ closeGamble: true }));
        closeGamble.touchable = false;
        closeGamble.opacity = 0;
        closeGamble.modified();
        choiceNum1.touchable = true;
        choiceNum1.opacity = 1;
        choiceNum1.modified();
        resultPending = true;
        explain.text = "正解の選択肢を下のボタンで入力してください";
        explain.invalidate();
    });
}

// ユーザー名の設定
function register(scene, font, registerLayer, cookieLayer, rankingLayer) {
    let time = 0;
    let touched = false;
    let registerImage = new g.Sprite({
        scene: scene,
        parent: registerLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 110,
        y: 180,
        scaleX: 0.6,
        scaleY: 0.6,
        src: scene.asset.getImageById("cookie"),
        touchable: true,
        local: true,
    });
    registerImage.onPointDown.add(function () {
        if (!touched) {
            resolvePlayerInfo({ raises: true });
            touched = true;
            time = 0;
        }
    });
    scene.onUpdate.add(function () {
        time++;
        if (time > 30 * 5) {
            touched = false;
        }
    });
}

// クッキークリッカー
function cookieClick(scene, font, cookieLayer) {
    let score = 0;
    //console.log("score");
    let time = 0;
    let autoClicker = 0; // 自動クリック数
    let grandmaes = 0; // おばあちゃんの数
    let gamblers = 0; // 賭けの倍率
    let waitUpdate = 0; // メッセージを投げてからの時間
    let doubleClicker = 0; // ダブルクリック数

    function earn(num) {
        // 増えたクッキーの情報を更新
        //console.log(num);
        g.game.raiseEvent(new g.MessageEvent({ earn: num }));
        cookieCounter.text = (num + score).toString() + "枚";
        cookieCounter.invalidate();
    }
    function lose(num) {
        // 減ったクッキーの情報を更新
        g.game.raiseEvent(new g.MessageEvent({ lose: num }));
        cookieCounter.text = (score - num).toString() + "枚";
        cookieCounter.invalidate();
    }

    function update() {
        if (!g.game.isActiveInstance() && updateAllow) {
            //　リロード対策として最新情報の取得
            score = playersTable[g.game.selfId].score;
            autoClicker = playersTable[g.game.selfId].buy[0];
            grandmaes = playersTable[g.game.selfId].buy[1];
            gamblers = playersTable[g.game.selfId].buy[2];
            doubleClicker = playersTable[g.game.selfId].buy[3];
            cookieCounter.text = score.toString() + "枚";
            cookieCounter.invalidate();
        }
    }
    let cookieClickerBackGround = new g.FilledRect({
        scene: scene,
        parent: cookieLayer,
        cssColor: "white",
        width: 220,
        height: 120,
        x: 0,
        y: 0,
        local: true,
        opacity: 0.5,
    });

    let cookieCounter = new g.Label({
        scene: scene,
        parent: cookieLayer,
        font: font,
        textColor: "#593018",
        anchorX: 0.5,
        anchorY: 0.5,
        text: "0枚",
        fontSize: 50,
        x: 110,
        y: 55,
        local: true,
    });
    let clickSpeed = new g.Label({
        scene: scene,
        parent: cookieLayer,
        font: font,
        textColor: "#F2D3AC",
        anchorX: 0.5,
        anchorY: 0.5,
        text: "分速0枚",
        fontSize: 25,
        x: 110,
        y: 95,
        local: true,
    });
    let cookie = new g.Sprite({
        scene: scene,
        parent: cookieLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 110,
        y: 180,
        scaleX: 0.6,
        scaleY: 0.6,
        src: scene.asset.getImageById("cookie"),
        touchable: true,
        local: true,
    });
    let shop = new g.Sprite({
        scene: scene,
        parent: cookieLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 220,
        y: 170,
        scaleX: 0.2,
        scaleY: 0.2,
        src: scene.asset.getImageById("shop"),
        touchable: true,
        local: true,
    });
    let autoClick = new g.Sprite({
        scene: scene,
        parent: cookieLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 180,
        y: 300,
        scaleX: 0.5,
        scaleY: 0.5,
        src: scene.asset.getImageById("autoClick"),
        touchable: false,
        opacity: 0,
        local: true,
    });
    let grandma = new g.Sprite({
        scene: scene,
        parent: cookieLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 180,
        y: 380,
        scaleX: 0.5,
        scaleY: 0.5,
        src: scene.asset.getImageById("grandma"),
        touchable: false,
        opacity: 0,
        local: true,
    });
    let gambler = new g.Sprite({
        scene: scene,
        parent: cookieLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 180,
        y: 460,
        scaleX: 0.5,
        scaleY: 0.5,
        src: scene.asset.getImageById("gambler"),
        touchable: false,
        opacity: 0,
        local: true,
    });
    let doubleClick = new g.Sprite({
        scene: scene,
        parent: cookieLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 180,
        y: 540,
        scaleX: 0.5,
        scaleY: 0.5,
        src: scene.asset.getImageById("doubleClick"),
        touchable: false,
        opacity: 0,
        local: true,
    });
    cookie.onPointDown.add(function () {
        cookie.scaleX = 0.65;
        cookie.scaleY = 0.65;
        cookie.modified();
        let clickCount = 2 ** doubleClicker;
        earn(clickCount); // クリック数を送信
        scene.asset.getAudioById("ClickSE").play();
    });
    cookie.onPointUp.add(function () {
        cookie.scaleX = 0.6;
        cookie.scaleY = 0.6;
        cookie.modified();
    });
    autoClick.onPointDown.add(function () {
        autoClick.opacity = 0;
        autoClick.touchable = false;
        autoClick.modified();
        lose(50);
        shop.opacity = 0;
        shop.touchable = false;
        shopShowing = false;
        shop.modified();
        g.game.raiseEvent(new g.MessageEvent({ buy: "autoClick" }));
        scene.asset.getAudioById("BuySE").play();
    });
    grandma.onPointDown.add(function () {
        grandma.opacity = 0;
        grandma.touchable = false;
        grandma.modified();
        lose(150);
        shop.opacity = 0;
        shop.touchable = false;
        shopShowing = false;
        shop.modified();
        g.game.raiseEvent(new g.MessageEvent({ buy: "grandma" }));
        scene.asset.getAudioById("BuySE").play();
    });
    gambler.onPointDown.add(function () {
        gambler.opacity = 0;
        gambler.touchable = false;
        gambler.modified();
        lose(500);
        shop.opacity = 0;
        shop.touchable = false;
        shopShowing = false;
        shop.modified();
        g.game.raiseEvent(new g.MessageEvent({ buy: "gambler" }));
        scene.asset.getAudioById("BuySE").play();
    });
    doubleClick.onPointDown.add(function () {
        doubleClicker++;
        doubleClick.opacity = 0;
        doubleClick.touchable = false;
        doubleClick.modified();
        lose(300);
        shop.opacity = 0;
        shop.touchable = false;
        shopShowing = false;
        shop.modified();
        g.game.raiseEvent(new g.MessageEvent({ buy: "doubleClick" }));
        scene.asset.getAudioById("BuySE").play();
    });
    let shopShowing = false;
    shop.onPointDown.add(function () {
        if (shopShowing) {
            shopShowing = false;
            autoClick.opacity = 0;
            autoClick.touchable = false;
            autoClick.modified();
            grandma.opacity = 0;
            grandma.touchable = false;
            grandma.modified();
            gambler.opacity = 0;
            gambler.touchable = false;
            gambler.modified();
            doubleClick.opacity = 0;
            doubleClick.touchable = false;
            doubleClick.modified();
        } else {
            shopShowing = true;
            autoClick.opacity = 1;
            autoClick.touchable = true;
            autoClick.modified();
            grandma.opacity = 1;
            grandma.touchable = true;
            grandma.modified();
            gambler.opacity = 1;
            gambler.touchable = true;
            gambler.modified();
            doubleClick.opacity = 1;
            doubleClick.touchable = true;
            doubleClick.modified();
        }
    });
    scene.onUpdate.add(function () {
        time += 1;
        update();
        if (time % 30 == 0) {
            clickSpeed.text =
                "分速" + ((score / time) * g.game.fps * 60).toFixed(0) + "枚";
            clickSpeed.invalidate();
        }
        if (time % 300 == 0) {
            let clickCount = 2 ** doubleClicker * autoClicker;
            earn(clickCount); // クリック数を送信
        }
        if (time % 150 == 0) {
            earn(grandmaes);
        }
        if (score >= 50) {
            shop.opacity = 1;
            shop.touchable = true;
            shop.modified();
        } else {
            shop.opacity = 0;
            shop.touchable = false;
            shop.modified();
        }
        if (shopShowing && score >= 50) {
            autoClick.opacity = 1;
            autoClick.touchable = true;
            autoClick.modified();
        } else {
            autoClick.opacity = 0;
            autoClick.touchable = false;
            autoClick.modified();
        }
        if (shopShowing && score >= 150) {
            grandma.opacity = 1;
            grandma.touchable = true;
            grandma.modified();
        } else if (shopShowing && score < 150) {
            grandma.opacity = 0.5;
            grandma.touchable = false;
            grandma.modified();
        } else {
            grandma.opacity = 0;
            grandma.touchable = false;
            grandma.modified();
        }
        if (shopShowing && score >= 500) {
            gambler.opacity = 1;
            gambler.touchable = true;
            gambler.modified();
        } else if (shopShowing && score < 500) {
            gambler.opacity = 0.5;
            gambler.touchable = false;
            gambler.modified();
        } else {
            gambler.opacity = 0;
            gambler.touchable = false;
            gambler.modified();
        }
        if (shopShowing && score >= 300) {
            doubleClick.opacity = 1;
            doubleClick.touchable = true;
            doubleClick.modified();
        } else if (shopShowing && score < 300) {
            doubleClick.opacity = 0.5;
            doubleClick.touchable = false;
            doubleClick.modified();
        } else {
            doubleClick.opacity = 0;
            doubleClick.touchable = false;
            doubleClick.modified();
        }
    });

    scene.onMessage.add(function (msg) {
        if (msg.data.bet && msg.player.id == g.game.selfId) {
            // ユーザーが賭けた時
            score -= msg.data.bet[1]; // 賭けたクッキーの数を減らす
            cookieCounter.text = score.toString() + "枚";
            cookieCounter.invalidate();
        } else if (msg.data.dividend) {
            // 配当
            score += msg.data.dividend;
            cookieCounter.text = score.toString() + "枚";
            cookieCounter.invalidate();
        }
    });
}

// 投票画面の生成
function gamble(scene, font, betInputLayer, choiceNum) {
    let selecting = true; // 賭けの選択肢を選んでいるか、(falseならポイントを入力中)
    let confirming = false; // 投票を終えたか
    let betInfo = [0, 0]; // ユーザーの賭けの情報

    // 投票画面の生成
    function keySum(array, betScoreIndi) {
        let num = 0;
        for (let i = 0; i < array.length; i++) {
            num += array[i] * Math.pow(10, array.length - i - 1);
        }
        if (selecting) {
            betScoreIndi.text = num.toString() + "番の選択肢に投票します";
            betScoreIndi.invalidate();
            if (num > choiceNum || num == 0) {
                confirmBtn.hide();
            } else {
                confirmBtn.show();
            }
        } else {
            if (!playersTable.hasOwnProperty(g.game.selfId)) {
                betScoreIndi.text = "先にクッキーを増やそう！";
                betScoreIndi.invalidate();
                confirmBtn.touchable = false;
                confirmBtn.opacity = 0;
                confirmBtn.modified();
                return num;
            }
            betScoreIndi.text = num.toString() + "個のクッキーを賭けます";
            betScoreIndi.invalidate();
            if (num > playersTable[g.game.selfId].score || num == 0) {
                confirmBtn.hide();
            } else {
                confirmBtn.show();
            }
        }
        return num;
    }
    const key1 = new g.Sprite({
        scene: scene,
        parent: betInputLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 900,
        y: 170,
        scaleX: 0.15,
        scaleY: 0.15,
        src: scene.asset.getImageById("key1"),
        touchable: true,
        local: true,
    });
    const key2 = new g.Sprite({
        scene: scene,
        parent: betInputLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 1000,
        y: 170,
        scaleX: 0.15,
        scaleY: 0.15,
        src: scene.asset.getImageById("key2"),
        touchable: true,
        local: true,
    });
    const key3 = new g.Sprite({
        scene: scene,
        parent: betInputLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 1100,
        y: 170,
        scaleX: 0.15,
        scaleY: 0.15,
        src: scene.asset.getImageById("key3"),
        touchable: true,
        local: true,
    });
    const key4 = new g.Sprite({
        scene: scene,
        parent: betInputLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 900,
        y: 250,
        scaleX: 0.15,
        scaleY: 0.15,
        src: scene.asset.getImageById("key4"),
        touchable: true,
        local: true,
    });
    const key5 = new g.Sprite({
        scene: scene,
        parent: betInputLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 1000,
        y: 250,
        scaleX: 0.15,
        scaleY: 0.15,
        src: scene.asset.getImageById("key5"),
        touchable: true,
        local: true,
    });
    const key6 = new g.Sprite({
        scene: scene,
        parent: betInputLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 1100,
        y: 250,
        scaleX: 0.15,
        scaleY: 0.15,
        src: scene.asset.getImageById("key6"),
        touchable: true,
        local: true,
    });
    const key7 = new g.Sprite({
        scene: scene,
        parent: betInputLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 900,
        y: 330,
        scaleX: 0.15,
        scaleY: 0.15,
        src: scene.asset.getImageById("key7"),
        touchable: true,
        local: true,
    });
    const key8 = new g.Sprite({
        scene: scene,
        parent: betInputLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 1000,
        y: 330,
        scaleX: 0.15,
        scaleY: 0.15,
        src: scene.asset.getImageById("key8"),
        touchable: true,
        local: true,
    });
    const key9 = new g.Sprite({
        scene: scene,
        parent: betInputLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 1100,
        y: 330,
        scaleX: 0.15,
        scaleY: 0.15,
        src: scene.asset.getImageById("key9"),
        touchable: true,
        local: true,
    });
    const key0 = new g.Sprite({
        scene: scene,
        parent: betInputLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        scaleX: 0.15,
        scaleY: 0.15,
        x: 1200,
        y: 330,
        src: scene.asset.getImageById("key0"),
        touchable: true,
        local: true,
    });
    const confirmBtn = new g.Sprite({
        scene: scene,
        parent: betInputLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 1120,
        y: 420,
        scaleX: 0.3,
        scaleY: 0.3,
        src: scene.asset.getImageById("confirm"),
        touchable: true,
        local: true,
    });
    const deleteBtn = new g.Sprite({
        scene: scene,
        parent: betInputLayer,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 940,
        y: 420,
        scaleX: 0.3,
        scaleY: 0.3,
        src: scene.asset.getImageById("delete"),
        touchable: true,
        local: true,
    });
    const hide = new g.Sprite({
        scene: scene,
        anchorX: 0.5,
        anchorY: 0.5,
        x: 1200,
        y: 210,
        scaleX: 0.3,
        scaleY: 0.3,
        src: scene.asset.getImageById("hide"),
        touchable: true,
        local: true,
    });
    scene.append(hide);
    const betScoreIndi = new g.Label({
        scene: scene,
        parent: betInputLayer,
        font: font,
        fontSize: 30,
        textColor: "#593018",
        text: "",
        anchorX: 0.5,
        anchorY: 0.5,
        x: 1050,
        y: 100,
        local: true,
    });

    const confirmInfo = new g.Label({
        scene: scene,
        parent: betInputLayer,
        font: font,
        fontSize: 30,
        textColor: "#593018",
        text: "投票したい選択肢を入力しよう！",
        anchorX: 0.5,
        anchorY: 0.5,
        x: 1050,
        y: 50,
        local: true,
    });
    let keyLen = [];
    key1.onPointDown.add(function () {
        keyLen.push(1);
        keySum(keyLen, betScoreIndi);
    });
    key2.onPointDown.add(function () {
        keyLen.push(2);
        keySum(keyLen, betScoreIndi);
    });
    key3.onPointDown.add(function () {
        keyLen.push(3);
        keySum(keyLen, betScoreIndi);
    });
    key4.onPointDown.add(function () {
        keyLen.push(4);
        keySum(keyLen, betScoreIndi);
    });
    key5.onPointDown.add(function () {
        keyLen.push(5);
        keySum(keyLen, betScoreIndi);
    });
    key6.onPointDown.add(function () {
        keyLen.push(6);
        keySum(keyLen, betScoreIndi);
    });
    key7.onPointDown.add(function () {
        keyLen.push(7);
        keySum(keyLen, betScoreIndi);
    });
    key8.onPointDown.add(function () {
        keyLen.push(8);
        keySum(keyLen, betScoreIndi);
    });
    key9.onPointDown.add(function () {
        keyLen.push(9);
        keySum(keyLen, betScoreIndi);
    });
    key0.onPointDown.add(function () {
        keyLen.push(0);
        keySum(keyLen, betScoreIndi);
    });
    deleteBtn.onPointDown.add(function () {
        keyLen.pop();
        keySum(keyLen, betScoreIndi);
    });
    let hiding = false;
    hide.onPointDown.add(function () {
        if (hiding) {
            betInputLayer.opacity = 1;
            betInputLayer.modified();
            hiding = false;
        } else {
            betInputLayer.opacity = 0;
            betInputLayer.modified();
            hiding = true;
        }
    });

    confirmBtn.onPointDown.add(function () {
        if (selecting) {
            // 非表示になっている選択肢ボタンを表示
            for (let i = 0; i <= 9; i++) {
                const element = eval("key" + i.toString());
                element.touchable = true;
                element.opacity = 1;
                element.modified();
            }
            betInfo[0] = keySum(keyLen, betScoreIndi);
            confirmInfo.text = betInfo[0].toString() + "に投票中";
            confirmInfo.invalidate();
            betScoreIndi.text = "賭けるクッキーの数を入力しよう！";
            betScoreIndi.invalidate();
            selecting = false;
        } else {
            betInfo[1] += keySum(keyLen, betScoreIndi);
            g.game.raiseEvent(new g.MessageEvent({ bet: betInfo }));
            confirming = true;
            //　初期化
            betInfo = [0, 0];
            confirmInfo.text = "";
            confirmInfo.invalidate();
            betScoreIndi.text = "";
            betScoreIndi.invalidate();
            betInputLayer.destroy();
            hide.destroy();
        }
        keyLen = [];
    });
    scene.onMessage.add(function (msg) {
        if (msg.data.closeGamble && !confirming && !g.game.isActiveInstance()) {
            betInputLayer.destroy();
            hide.destroy();
        }
    });
    // 賭けの選択肢の表示を選択肢の数だけ表示させる
    for (let i = 0; i <= 9; i++) {
        if (i == 0 || choiceNum < i) {
            const element = eval("key" + i.toString());
            element.touchable = false;
            element.opacity = 0;
            element.modified();
        }
    }
}

function calcOdds(choice) {
    // オッズの表示
    const odds = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
    };

    // 各選択肢での賭けられたポイントの合計を計算
    for (const key in playersTable) {
        const bet = playersTable[key].bet;
        const betAmount = bet[1];

        odds[bet[0]] += betAmount;
    }

    // 賭けられた総ポイントを計算
    let totalAmount = 0;
    for (const key in odds) {
        totalAmount += odds[key];
    }

    // オッズを計算して表示
    for (const key in odds) {
        if (key === "0") continue;
        const betChoice = Number(key);
        const oddsValue = totalAmount / odds[betChoice];
        if (key == choice) {
            return oddsValue;
        }
    }
}

function odds(scene, font, oddsLayer) {
    let time = 0;
    let destroy = false; // 投票画面が破棄されたか
    let choiceSum = {
        //オッズが入る
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
    };
    let oddsBackground = new g.FilledRect({
        scene: scene,
        parent: oddsLayer,
        cssColor: "White",
        opacity: 0.5,
        width: 1280,
        height: 33,
        x: 0,
        y: 0,
        local: true,
    });
    let odds1 = new g.Label({
        scene: scene,
        parent: oddsLayer,
        font: font,
        fontSize: 25,
        textColor: "#593018",
        text: "",
        anchorX: 0.5,
        anchorY: 0.5,
        x: 90,
        y: 20,
        local: true,
    });
    let odds2 = new g.Label({
        scene: scene,
        parent: oddsLayer,
        font: font,
        fontSize: 25,
        textColor: "#593018",
        text: "",
        anchorX: 0.5,
        anchorY: 0.5,
        x: 290,
        y: 20,
        local: true,
    });
    let odds3 = new g.Label({
        scene: scene,
        parent: oddsLayer,
        font: font,
        fontSize: 25,
        textColor: "#593018",
        text: "",
        anchorX: 0.5,
        anchorY: 0.5,
        x: 490,
        y: 20,
        local: true,
    });
    let odds4 = new g.Label({
        scene: scene,
        parent: oddsLayer,
        font: font,
        fontSize: 25,
        textColor: "#593018",
        text: "",
        anchorX: 0.5,
        anchorY: 0.5,
        x: 690,
        y: 20,
        local: true,
    });
    let odds5 = new g.Label({
        scene: scene,
        parent: oddsLayer,
        font: font,
        fontSize: 25,
        textColor: "#593018",
        text: "",
        anchorX: 0.5,
        anchorY: 0.5,
        x: 890,
        y: 20,
        local: true,
    });
    let odds6 = new g.Label({
        scene: scene,
        parent: oddsLayer,
        font: font,
        fontSize: 25,
        textColor: "#593018",
        text: "",
        anchorX: 0.5,
        anchorY: 0.5,
        x: 1090,
        y: 20,
        local: true,
    });
    let odds7 = new g.Label({
        scene: scene,
        parent: oddsLayer,
        font: font,
        fontSize: 25,
        textColor: "#593018",
        text: "",
        anchorX: 0.5,
        anchorY: 0.5,
        x: 370,
        y: 50,
        local: true,
    });
    let odds8 = new g.Label({
        scene: scene,
        parent: oddsLayer,
        font: font,
        fontSize: 25,
        textColor: "#593018",
        text: "",
        anchorX: 0.5,
        anchorY: 0.5,
        x: 570,
        y: 50,
        local: true,
    });
    let odds9 = new g.Label({
        scene: scene,
        parent: oddsLayer,
        font: font,
        fontSize: 25,
        textColor: "#593018",
        text: "",
        anchorX: 0.5,
        anchorY: 0.5,
        x: 770,
        y: 50,
        local: true,
    });

    scene.onUpdate.add(function () {
        if (!gambleTime) return;
        time++;

        if (time % 30 === 0) {
            // オッズの表示

            // 各選択肢での賭けられたポイントの合計を計算
            for (const key in playersTable) {
                const bet = playersTable[key].bet;
                const betAmount = bet[1];

                choiceSum[bet[0]] += betAmount;
            }

            // 賭けられた総ポイントを計算
            let totalAmount = 0;
            for (const key in choiceSum) {
                totalAmount += choiceSum[key];
            }
            // オッズを計算して表示
            for (const key in choiceSum) {
                if (key === "0") continue;
                const betChoice = Number(key);
                const oddsValue = totalAmount / choiceSum[betChoice];
                if (choiceSum[betChoice] != 0) {
                    const label = eval(`odds${key}`);
                    label.text = `${key}番: ${oddsValue.toFixed(3)}倍`;
                    label.invalidate();
                }
            }
        }
    });
    scene.onMessage.add(function (msg) {
        if (msg.data.result && destroy == false) {
            // 結果発表されたら
            choiceSum = {
                //オッズ変数の初期化
                0: 0,
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0,
            };
            oddsLayer.destroy();
            destroy = true;
        }
    });
}

function dividend(scene, font, dividendLayer, resultInfo) {
    let time = 0;
    let destroy = false;
    let dividedResult = new g.Label({
        scene: scene,
        parent: dividendLayer,
        font: font,
        fontSize: 50,
        textColor: "#593018",
        text: "",
        anchorX: 0.5,
        anchorY: 0.5,
        x: 640,
        y: 100,
        local: true,
    });

    scene.asset.getAudioById("JRA").play();
    if (!g.game.isActiveInstance()) {
        const mybet = playersTable[g.game.selfId].bet[0];
        let bonus = playersTable[g.game.selfId].buy[2];

        if (mybet === resultInfo) {
            const myOdds = calcOdds(mybet);
            if (bonus > 0) {
                bonus = bonus * 2;
            } else {
                bonus = 1;
            }
            const getScore = Math.floor(
                playersTable[g.game.selfId].bet[1] * myOdds * bonus
            );
            console.log(getScore);

            dividedResult.text = `配当: ${getScore}枚`;
            dividedResult.invalidate();

            g.game.raiseEvent(new g.MessageEvent({ dividend: getScore }));
        } else {
            g.game.raiseEvent(new g.MessageEvent({ dividend: 0 }));
        }
    }

    scene.onUpdate.add(function () {
        time++;
        if (time >= 30 * 6 && !destroy) {
            dividendLayer.destroy();
            destroy = true;
        }
        if (time % 40 == 0) {
            dividendLayer.hide();
        } else if (time % 20 == 0) {
            dividendLayer.show();
        }
    });
}

function ranking(scene, font, rankingLayer) {
    let RankingBackgroundColor = new g.FilledRect({
        scene: scene,
        parent: rankingLayer,
        cssColor: "White",
        width: 450,
        height: 400,
        x: 0,
        y: 450,
        opacity: 0,
    });
    let R1 = new g.Label({
        scene: scene,
        parent: rankingLayer,
        font: font,
        fontSize: 25,
        textColor: "#A66038",
        text: "",
        anchorX: 0.5,
        anchorY: 0.5,
        x: 200,
        y: 490,
        local: true,
    });
    let R2 = new g.Label({
        scene: scene,
        parent: rankingLayer,
        font: font,
        fontSize: 22,
        textColor: "#A66038",
        text: "",
        anchorX: 0.5,
        anchorY: 0.5,
        x: 200,
        y: 520,
        local: true,
    });
    let R3 = new g.Label({
        scene: scene,
        parent: rankingLayer,
        font: font,
        fontSize: 19,
        textColor: "#A66038",
        text: "",
        anchorX: 0.5,
        anchorY: 0.5,
        x: 200,
        y: 550,
        local: true,
    });
    let R4 = new g.Label({
        scene: scene,
        parent: rankingLayer,
        font: font,
        fontSize: 16,
        textColor: "#A66038",
        text: "",
        anchorX: 0.5,
        anchorY: 0.5,
        x: 200,
        y: 580,
        local: true,
    });
    let R5 = new g.Label({
        scene: scene,
        parent: rankingLayer,
        font: font,
        fontSize: 13,
        textColor: "#A66038",
        text: "",
        anchorX: 0.5,
        anchorY: 0.5,
        x: 200,
        y: 610,
        local: true,
    });
    let yourRank = new g.Label({
        scene: scene,
        parent: rankingLayer,
        font: font,
        fontSize: 28,
        textColor: "#261109",
        text: "",
        anchorX: 0.5,
        anchorY: 0.5,
        x: 300,
        y: 690,
        local: true,
    });
    const Rankbutton = new g.Sprite({
        scene: scene,
        parent: rankingLayer,
        src: scene.assets["ranking"],
        x: 80,
        y: 650,
        anchorX: 0.5,
        anchorY: 0.5,
        scaleX: 0.4,
        scaleY: 0.4,
        local: true,
        touchable: true,
    });
    R1.hide();
    R2.hide();
    R3.hide();
    R4.hide();
    R5.hide();
    yourRank.hide();
    let showRank = false;
    Rankbutton.pointDown.add(function () {
        if (showRank) {
            R1.hide();
            R2.hide();
            R3.hide();
            R4.hide();
            R5.hide();
            yourRank.hide();
            RankingBackgroundColor.opacity = 0;
            RankingBackgroundColor.modified();
            showRank = false;
        } else {
            R1.show();
            R2.show();
            R3.show();
            R4.show();
            R5.show();
            yourRank.show();
            RankingBackgroundColor.opacity = 0.6;
            RankingBackgroundColor.modified();
            showRank = true;
        }
    });

    scene.onUpdate.add(function () {
        const sortedIDs = Object.keys(playersTable).sort(
            (a, b) => playersTable[b].score - playersTable[a].score
        );
        // 上から5番目までのスコアと名前を出力
        for (let i = 0; i < 5 && i < sortedIDs.length; i++) {
            const playerID = sortedIDs[i];
            const player = playersTable[playerID];
            const label = eval(`R${i + 1}`);
            label.text = `${i + 1}位: ${player.name} ${player.score}枚`;
            label.invalidate();
        }
        // 自分の順位を出力
        if (!g.game.isActiveInstance()) {
            const myID = g.game.selfId;
            const myRank = sortedIDs.indexOf(myID) + 1;
            yourRank.text = `あなたは${myRank}位です`;
            yourRank.invalidate();
        }
    });
}

// エントリポイント
function main(param) {
    const scene = new g.Scene({
        game: g.game,
        // このシーンで利用するアセットのIDを列挙し、シーンに通知します
        assetIds: [
            "cookie",
            "startGamble",
            "key1",
            "key2",
            "key3",
            "key4",
            "key5",
            "key6",
            "key7",
            "key8",
            "key9",
            "key0",
            "hide",
            "delete",
            "confirm",
            "close",
            "ranking",
            "JRA",
            "shop",
            "autoClick",
            "ClickSE",
            "BuySE",
            "grandma",
            "gambler",
            "doubleClick",
        ],
    });
    const font = new g.DynamicFont({
        game: g.game,
        fontFamily: g.FontFamily.SansSerif,
        fontWeight: g.FontWeight.Bold,
        size: 50,
    });
    const streamerLayer = new g.E({
        scene: scene,
        parent: scene,
        local: true,
    });
    const registerLayer = new g.E({
        scene: scene,
        parent: scene,
        local: true,
    });
    const cookieLayer = new g.E({
        scene: scene,
        parent: scene,
        local: true,
    });
    let oddsLayer = new g.E({
        scene: scene,
        parent: scene,
        local: true,
    });
    const rankingLayer = new g.E({
        scene: scene,
        parent: scene,
        local: true,
    });
    scene.onLoad.add(function () {
        // ここからゲーム内容を記述します
        let broadcastPlyerId;
        g.game.onPlayerInfo.add((ev) => {
            const player = ev.player;
            let myID = player.id;
            //console.log(myID);
            if (!(myID in playersTable)) {
                playersTable[myID] = {
                    name: player.name, // 名前
                    score: 0, // スコア
                    betting: false, // 賭け中かどうか
                    bet: [0, 0], // 賭けた選択肢と賭けたクッキ賭けたクッキーの数
                    buy: [0, 0, 0, 0], // 購入したアイテム[自動クリック, グランマ, ギャンブラー, ダブルクリック]
                };
            }
            if (!g.game.isActiveInstance() && myID == g.game.selfId) {
                registerLayer.hide();
                cookieClick(scene, font, cookieLayer);
                ranking(scene, font, rankingLayer);
                if (g.game.selfId === broadcastPlyerId) {
                    streamer(scene, font, streamerLayer);
                }
            }
        });
        g.game.onJoin.add((ev) => {
            broadcastPlyerId = ev.player.id;
        });
        register(scene, font, registerLayer, cookieLayer, rankingLayer);
        scene.onMessage.add((msg) => {
            if (msg.data.earn) {
                // クッキーが増えたとき
                playersTable[msg.player.id].score += msg.data.earn;
            } else if (msg.data.lose) {
                // クッキーが減ったとき
                playersTable[msg.player.id].score -= msg.data.lose;
            } else if (msg.data.startGamble) {
                // 賭け開始
                let betInputLayer = new g.E({
                    scene: scene,
                    parent: scene,
                    local: true,
                });
                let oddsLayer = new g.E({
                    scene: scene,
                    parent: scene,
                    local: true,
                });
                //console.log("startGamble");
                gambleTime = true;
                gamble(scene, font, betInputLayer, msg.data.choiceNum);
                odds(scene, font, oddsLayer);
            } else if (msg.data.bet) {
                // ユーザーが賭けたとき
                playersTable[msg.player.id].bet = msg.data.bet;
                playersTable[msg.player.id].betting = true;
                playersTable[msg.player.id].score -= msg.data.bet[1];
                //console.log(playersTable);
            } else if (msg.data.result) {
                let dividendLayer = new g.E({
                    scene: scene,
                    parent: scene,
                    local: true,
                });
                // 結果発表
                dividend(scene, font, dividendLayer, msg.data.result);
            } else if (msg.data.dividend) {
                // 配当
                playersTable[msg.player.id].score += msg.data.dividend;
                playersTable[msg.player.id].bet = [0, 0];
                playersTable[msg.player.id].betting = false;
            } else if (msg.data.buy) {
                // アイテム購入
                if (msg.data.buy == "autoClick") {
                    playersTable[msg.player.id].buy[0]++;
                }
                if (msg.data.buy == "grandma") {
                    playersTable[msg.player.id].buy[1]++;
                }
                if (msg.data.buy == "gambler") {
                    playersTable[msg.player.id].buy[2]++;
                }
                if (msg.data.buy == "doubleClick") {
                    playersTable[msg.player.id].buy[3]++;
                }
            }
        });
        // ここまでゲーム内容を記述します
    });
    g.game.pushScene(scene);
}
module.exports = main;
