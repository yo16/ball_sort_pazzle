// 色数と深さから問題を作る
function create_question(color_num, depth){
    // 問題
    let q = [];

    // 空の箱の数
    // とりあえず固定しておくが、あとで自動的に増やす仕組みにする
    let empty_box_num = 1;

    // 色を詰める
    for(let color=0; color<color_num; color++){
        let box = [];
        for(let j=0; j<depth; j++){
            box.push(color);
        }
        q.push(box);
    }

    // 空のbox
    for(let e=0; e<empty_box_num; e++){
        q.push([]);
    }

    // 移動
    //make_question(q, depth);

    return q;
}

function make_question(q, depth){
    let move_count = 0;
    let move_count_goal = 10;    // この数分動かす

    while(move_count<move_count_goal){
        let box1 = get_random_int(q.length);
        let box2 = get_random_int(q.length);

        if (box1==box2){
            continue;
        }
        if (q[box2].length>=depth){
            continue;
        }
        // 移動元の一番上とその下が同じ色でないと移動不可
        if (q[box1][q[box1].length-1]!=q[box1][q[box1].length-2]){
            continue;
        }

        // 移動
        let col = q[box1].pop();
        q[box2].push(col);

        move_count++;
    }
}

function get_random_int(max){
    return Math.floor(Math.random() * max);
}