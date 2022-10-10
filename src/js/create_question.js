// 色数と深さから問題を作る
function create_question(color_num, depth){
    // 問題
    let q = [];

    // 空の箱の数
    // とりあえず固定しておくが、あとで自動的に増やす仕組みにする
    let empty_box_num = 2;

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
    make_question(q, depth);

    return q;
}

function make_question(q, depth){
    let move_count = 0;
    let move_count_goal = 100;    // この数分動かす

    let try_count = 0;
    let try_max = 10000;
    while(move_count<move_count_goal){
        try_count++;
        if (try_max<try_count){
            break;
        }

        let box1 = get_random_int(q.length);
        let box2 = get_random_int(q.length);
        let box1_len = q[box1].length;
        let box2_len = q[box2].length;

        // fromが空だったらNG
        if (box1_len==0){
            continue;
        }
        // from-toが一緒だったらNG
        if (box1==box2){
            continue;
        }
        // toがいっぱいだったらNG
        if (box2_len>=depth){
            continue;
        }
        // 移動元の一番上とその下が同じ色でなかったらNG
        if (q[box1][box1_len-1]!=q[box1][box1_len-2]){
            continue;
        }

        // --- 必須ではないけど、複雑性を上げるための調整
        // toのboxが下３個同じ色だったらNG
        if (box2_len>=3){
            let top1 = q[box2][box2_len-1];
            let top2 = q[box2][box2_len-2];
            let top3 = q[box2][box2_len-3];
            if ((top1==top2)&&(top1==top3)){
                continue;
            }
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