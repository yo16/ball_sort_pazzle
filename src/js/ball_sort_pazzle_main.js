// テストデータ(左が底)
var boxes = [
    [1,1,2,2],
    [2,3,1,3],
    [1,3,2,3],
    []
];

// ボールの直径
var BALL_D = 100;
// 番号に対する色
var COLORS10 = [
    "#17becf","#bcbd22","#7f7f7f","#e377c2","#8c564b",
    "#9467bd","#d62728","#2ca02c","#ff7f0e","#1f77b4",
];
//var COLORS10 = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ffffff","#00ffff", "#ff00ff", "#000000", "#66ff00", "#0066ff"];
var BOX_PADDING = 20;
var BALL_PADDING = 8;
var BALL_HOVER_HEIGHT = 200;

// ボールの情報
var ball_info = null;

// 箱の深さ
var box_capacity = boxes[0].length;

function initialize(){
    // body
    d3.select("body").style("background-color", "#333");

    // svg
    let svg = d3.select("svg")
        .style("font-family", "'ヒラギノ角ゴ Pro W3',Hiragino Kaku Gothic Pro,'メイリオ',Meiryo,Osaka,'ＭＳ Ｐゴシック',MS PGothic,sans-serif")
    ;

    // 最初の描画
    initial_draw(svg);
}

function initial_draw(svg){
    // ball
    // 2次元配列の情報を1次元のハッシュに変換
    set_ball_info(boxes);
    // 表示
    let svg_g_balls = svg.append("g");
    svg_g_balls.selectAll(".ball")
        .data(ball_info)
        .enter()
        .append("circle")
        .attr("class", "ball")
        .attr("r", BALL_D/2)
        .attr("cx", function(d){ return get_ball_x_pos(d["box_i"]); })
        .attr("cy", function(d){ return get_ball_y_pos(d["box_i"], d["pos"]); })
        .attr("fill", function(d){ return COLORS10[d["num"]]; })
        .attr("box_i", function(d){ return d["box_i"]; })
        .attr("pos", function(d){ return d["pos"]; })
        .attr("ball_i", function(d, i){ return i; })
    ;

    // box
    let svg_g_box = svg.append("g");
    let svg_boxes = svg_g_box.selectAll(".box")
        .data(boxes)
        .enter()
        .append("polyline")
        .attr("class", "box")
        .attr("points", function(d, i){
            let px = get_box_x_pos(i);
            let py = get_box_y_pos(i);
            let points = [
                px-BOX_PADDING, py-BOX_PADDING,
                px-BOX_PADDING, py+BALL_D*box_capacity+BALL_PADDING*(box_capacity-1)+BOX_PADDING,
                px+BALL_D+BOX_PADDING, py+BALL_D*box_capacity+BALL_PADDING*(box_capacity-1)+BOX_PADDING,
                px+BALL_D+BOX_PADDING, py-BOX_PADDING,
            ];
            return points.join(',');
        })
        .attr("stroke", "#555")
        .attr("stroke-width", "20px")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("fill", "#fff")
        .attr("fill-opacity", "0.0")    // クリックを捉えるために透過100%のfillをかけている
        .attr("box_i", function(d, i){return i;})
        .attr("top_pos", function(d,i){
            let py = get_box_y_pos(i);
            return py - BOX_PADDING;
        })
        .on("click", function(d, i){
            move_ball(i);
        })
    ;
}
// 位置の取得系
// boxのleft
function get_box_x_pos(box_i){
    return (box_i%4)*250 + 100;
}
// boxのtop
function get_box_y_pos(box_i){
    return BALL_D + 300 + Math.floor(box_i/4) * 700;
}
// ballのcx
function get_ball_x_pos(box_i){
    return get_box_x_pos(box_i) + BALL_D/2;
}
// ballのcy
function get_ball_y_pos(box_i, ball_j){
    let box_py = get_box_y_pos(box_i);
    // ball_j= 0:底, ...
    return box_py + BALL_D*box_capacity + BALL_PADDING*(box_capacity-1)
    - (BALL_D+BALL_PADDING)*ball_j - BALL_D/2;
}
// ボールを浮かす位置
function get_hover_pos(box_i){
    return get_box_y_pos(box_i)-BALL_HOVER_HEIGHT+BALL_D/2;
}

// ２次元配列のbox(とball)情報を、１次元のball情報に変換
function set_ball_info(b){
    ball_info = [];
    let ball_index = 0;

    for(let i=0; i<b.length; i++){
        let balls = b[i];

        for(let j=0; j<balls.length; j++){
            ball_info.push({
                num: balls[j],
                box_i: i,
                pos: j,     // 底:0, ...
                ball_i: ball_index++
            });
        }
    }
}

// boxをクリックをしたらballを動かす
function move_ball(box_i){
    // boxの一番上の要素をフロートさせる
    function select_ball(_box_i){
        console.log("select_ball");
        // boxの一番上の要素を取得
        let top_i = -1;
        let max_pos = -1;
        for(let i=0; i<ball_info.length; i++){
            if (ball_info[i]["box_i"]==_box_i){
                if (max_pos < ball_info[i]["pos"]) {
                    top_i = i;
                }
            }
        }
        // 見つからない場合（空）は、なにもせず抜ける
        if (top_i==-1){
            console.log("not found!");
            return;
        }
        let cur_ball = ball_info[top_i];
        
        // ボールをフロートさせる、ついでに選択状態にする
        d3.selectAll(".ball[ball_i=\""+cur_ball["ball_i"]+"\"]")
            .classed('selected_ball', true)
            .transition()
            .duration(200)
            .attr("cy", get_hover_pos(_box_i))
        ;
    }
    // 選択を戻す
    function release_ball(){
        // ボールを戻す、ついでに選択状態を解除する
        d3.selectAll(".selected_ball")
            .classed('selected_ball', false)
            .transition()
            .duration(200)
            .attr("cy", function(d){
                console.log(d);
                return get_ball_y_pos(d["box_i"], d["pos"]);
            })
        ;
    }

    // 選択されているball
    let selected_ball = d3.select(".selected_ball");

    // 選択されているか、いないか
    if ( !selected_ball.empty() ){
        // 選択されている
        release_ball();
        /*
        let target_clicked_ball = get_target_ball(takeout_ball["box_index"]);
        // クリックしたboxが自分自身かどうか
        if (takeout_ball["box_index"] == box_i){
            // 自分自身
            // ひっこめる
            hikkomeru(target_clicked_ball);
        }
        // クリックしたboxへ、移動可能か、不可能か
        else{
            // 自分自身ではない
            // クリックしたboxの状態を確認
            let box_len = boxes[box_i].length;
            // MAXでない and (同じ色 or 空) なら移動可能
            if (
                (box_len < box_capacity) &&
                (
                    (boxes[box_i][box_len-1] == takeout_ball["ball_num"]) ||
                    (box_len==0)
                )
            ){
                // 移動する
                move(target_clicked_ball, takeout_ball["box_index"], box_i);
            }else{
                // ちょっと揺らす（ダメだよという表現）
                cant_move(target_clicked_ball);
            }
        }
        */

    }else{
        // 選択されていない
        // 選択する
        select_ball(box_i);
    }
}


initialize();
