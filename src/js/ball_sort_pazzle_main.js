// テストデータ(左が底)
var boxes = [
    [0,0,1,2],
    [1,0,0,2],
    [1,2,1,2],
    []
];

// データからゲームを作成
var game = new Game(boxes);

function initialize(){
    // body
    d3.select("body").style("background-color", "#333");

    // svg
    svg = d3.select("svg")
        .style("font-family", "'ヒラギノ角ゴ Pro W3',Hiragino Kaku Gothic Pro,'メイリオ',Meiryo,Osaka,'ＭＳ Ｐゴシック',MS PGothic,sans-serif")
    ;
}

// 描画
function init_show_boxes(){
    // ball
    let svg_g_ball = svg.append("g");
    svg_g_ball.selectAll(".ball")
        .data(game.get_balls())
        .enter()
        .append("circle")
        .classed("ball", true)
        .attr("r", Game.ball_d/2)
        .attr("cx", function(d){return d.cx;})
        .attr("cy", function(d){return d.cy;})
        .attr("fill", function(d){return d.color;})
        .attr("box_idx", function(d){return d.box_ins.box_index;})
        .attr("ball_idx", function(d){return d.ball_index;})
        .attr("ball_no", function(d){return d.ball_no;})
        .on("click", function(d){
            unselect_ball(d3.select(".ball[ball_idx=\""+d.ball_index+"\"]"));
        })
    ;

    // box
    let svg_g_box = svg.append("g");
    svg_g_box.selectAll(".box")
        .data(game.get_boxes())
        .enter()
        .append("polyline")
        .attr("class", "box")
        .attr("points", function(d){return d.points_str;})
        .attr("stroke", Game.box_stroke_color)
        .attr("stroke-width", Game.box_stroke_width)
        .attr("stroke-linecap", Game.box_linecap)
        .attr("stroke-linejoin", Game.box_linejoin)
        .attr("fill", Game.box_fill)
        .attr("fill-opacity", Game.box_fill_opacity)    // クリックを捉えるために透過100%のfillをかけている
        .attr("box_index", function(d){return d.box_index;})
        .on("click", function(d){
            select_ball(d);
        })
    ;
}

// ボールを取り出す
function select_ball(box_ins){
    let selected_ball = d3.select(".selected_ball");
    if (selected_ball.empty()){
        // 選択されていない
        let top_ball = box_ins.top_ball;
        d3.select(".ball[ball_idx=\"" + top_ball.ball_index + "\"]")
            .classed("selected_ball", true)
            .transition()
            .duration(Game.move_speed)
            .attr("cy", box_ins.pos_y - Game.ball_hover_height)
        ;
    }else{
        // 選択されている
        // クリックしたboxが元のboxか、そうでないか
        if (box_ins.box_index == selected_ball.attr("box_idx")){
            // 元のbox
            // 選択解除する
            unselect_ball(selected_ball);
        }else{
            // 元のboxとは別のbox
            // 移動可能か
            if (box_ins.is_acceptable_ball(selected_ball.attr("ball_no"))){
                // 移動可能
                game.move_ball(selected_ball.attr("box_idx"), box_ins.box_index);
                selected_ball
                    .classed("selected_ball", false)
                    .attr("box_idx", box_ins.box_index)
                    .transition()
                    .duration(Game.move_speed)
                    .attr("cx", box_ins.get_ball_pos_x())
                    .attr("cy", box_ins.pos_y - Game.ball_hover_height)
                    .transition()
                    .delay(Game.move_speed)
                    .duration(Game.move_speed)
                    .attr("cy", box_ins.get_ball_pos_y(box_ins.balls_len-1))
                ;
            }else{
                // 移動不可能
                let speed = Game.move_speed_fast;
                let width = 8;
                selected_ball
                    .transition()
                    .duration(speed)
                    .attr("transform", "translate("+width+", 0)")
        
                    .transition()
                    .delay(speed)
                    .duration(speed)
                    .attr("transform", "translate(-"+width+", 0)")
        
                    .transition()
                    .delay(speed*2)
                    .duration(speed)
                    .attr("transform", "translate("+width+", 0)")
        
                    .transition()
                    .delay(speed*3)
                    .duration(speed)
                    .attr("transform", "translate(-"+width+", 0)")
        
                    .transition()
                    .delay(speed*4)
                    .duration(speed)
                    .attr("transform", null)
                ;
            }
        }
    }
}
// 選択解除する
function unselect_ball(selected_ball){
    selected_ball
        .classed("selected_ball", false)
        .transition()
        .duration(Game.move_speed)
        .attr("cy", function(ball){
            let box_ins = ball.box_ins;
            let box_top_index = box_ins.balls.length - 1;
            return box_ins.get_ball_pos_y(box_top_index);
        })
    ;
}


initialize();
init_show_boxes();
