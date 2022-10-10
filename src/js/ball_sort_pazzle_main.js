
function initialize(){
    // body
    d3.select("body").style("background-color", "#333");

    // svg
    svg = d3.select("svg")
        .style("font-family", "'ヒラギノ角ゴ Pro W3',Hiragino Kaku Gothic Pro,'メイリオ',Meiryo,Osaka,'ＭＳ Ｐゴシック',MS PGothic,sans-serif")
    ;

    // モードボタン
    create_mode_button();

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
            select_box(d);
        })
    ;
}

// boxを指定して、ballを取り出す/移動先を指示する
function select_box(box_ins){
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
            if (box_ins.is_acceptable_ball(
                    game.get_ball(selected_ball.attr("ball_idx")),
                    game.current_game_mode
                )
            ){
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

// モードボタン
function create_mode_button(){
    let svg_g_mode = svg.append("g");

    let left = 830;
    let top = 10;
    let width = 140;
    let height = 40;

    // 背景
    let box_bk1_str = 
        "M " + left + " " + top +
        " L " + left + " " + (top+height) +
        " L " + (left+width/2) + " " + (top+height) + 
        " L " + (left+width/2) + " " + top +
        " Z";
    svg_g_mode.append("path")
        .attr("d", box_bk1_str)
        .attr("fill", "#ccc")
        .attr("stroke", "#ccc")
        .attr("stroke-width", "1")
    ;
    let box_bk2_str = 
        "M " + (left+width/2) + " " + top +
        " L " + (left+width/2) + " " + (top+height) +
        " L " + (left+width) + " " + (top+height) + 
        " L " + (left+width) + " " + top +
        " Z";
    svg_g_mode.append("path")
        .attr("d", box_bk2_str)
        .attr("fill", "#c99")
        .attr("stroke", "#c99")
        .attr("stroke-width", "1")
    ;

    // テキスト
    let text1_pos_x = left+20;
    let text1_pos_y = top+25;
    svg_g_mode.append("text")
        .attr("x", text1_pos_x)
        .attr("y", text1_pos_y)
        .attr("font-size", 14)
        .attr("stroke", "#666")
        .text("Play")
    ;
    let text2_pos_x = left+width/2+10;
    let text2_pos_y = top+25;
    svg_g_mode.append("text")
        .attr("x", text2_pos_x)
        .attr("y", text2_pos_y)
        .attr("font-size", 14)
        .attr("stroke", "#666")
        .text("Create")
    ;

    // スライダー
    function get_slider_d_str(mode){
        // mode: [0:create, 1:play]
        let slider_left = left + 10 +mode*(width/2 - 10);
        let slider_top = top + 10;
        let slider_width = width/2 - 10;
        let slider_height = height - 20;
        let box_slider_d_str = 
            "M " + slider_left + " " + slider_top +
            " L " + slider_left + " " + (slider_top+slider_height) +
            " L " + (slider_left+slider_width) + " " + (slider_top+slider_height) + 
            " L " + (slider_left+slider_width) + " " + slider_top +
            " Z";
        return box_slider_d_str;
    }
    svg_g_mode.append("path")
        .classed("slider", true)
        .attr("d", get_slider_d_str(game.current_game_mode))
        .attr("fill", "#999")
        .attr("stroke", "#999")
        .attr("stroke-width", "10")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("mode", game.current_mode)
    ;

    // path
    // 枠とクリック対象
    let box_d_str = 
        "M " + left + " " + top +
        " L " + left + " " + (top+height) +
        " L " + (left+width) + " " + (top+height) + 
        " L " + (left+width) + " " + top +
        " Z";
    svg_g_mode.append("path")
        .attr("d", box_d_str)
        .attr("fill", "#c6c")
        .attr("fill-opacity", "0.0")
        .attr("stroke", "#66c")
        .attr("stroke-width", "10")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .on("click",function(d){
            let slider = d3.select(".slider");
            let mode_new = game.switch_game_mode();
            slider
                .attr("mode", mode_new)
                .transition()
                .duration(100)
                .attr("d", function(){return get_slider_d_str(mode_new);})
            ;
        })
    ;
}



var color_num = 8;
var depth = 4;
var empty_box_num = 2;
boxes = create_question(color_num, depth, empty_box_num);

// データからゲームを作成
var game = new Game(boxes, color_num, depth);

initialize();
init_show_boxes();
