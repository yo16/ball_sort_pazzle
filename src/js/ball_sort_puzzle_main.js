
function initialize(){
    // body
    d3.select("body").style("background-color", "#333");

    // svg
    svg = d3.select("svg")
        .style("font-family", "'ヒラギノ角ゴ Pro W3',Hiragino Kaku Gothic Pro,'メイリオ',Meiryo,Osaka,'ＭＳ Ｐゴシック',MS PGothic,sans-serif")
    ;

    // モードボタン
    create_mode_button();

    // 問題作成メニュー
    create_q_menu();
}

// 描画
function init_show_boxes(){
    // ball
    let svg_g_ball = svg.append("g")
    svg_g_ball.classed("g_balls", true);

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
    svg_g_box.classed("g_boxes", true);

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
    svg_g_mode
        .attr("transform", "translate(0,50)")
        .attr("style", "display:none")
    ;

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
        .attr("fill", "#666")
        .text("Play")
    ;
    let text2_pos_x = left+width/2+10;
    let text2_pos_y = top+25;
    svg_g_mode.append("text")
        .attr("x", text2_pos_x)
        .attr("y", text2_pos_y)
        .attr("font-size", 14)
        .attr("fill", "#666")
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

// 問題作成メニュー
function create_q_menu(){
    let svg_g_q = svg.append("g");
    svg_g_q
        .classed("q_menu",true)
        .attr("transform", "translate(0,50)")
    ;

    // 背景
    svg_g_q.append("rect")
        .attr("x", 10)
        .attr("y", 10)
        .attr("width", 800)
        .attr("height", 230)
        .attr("fill", "#666")
    ;

    // 固定文字列と、変更のものも要素は作っておく
    let font_size = 60;
    {
        let color_y = 30;
        let color_y_text = color_y + 40;   // textの下の位置
        svg_g_q.append("text")
            .classed("color_text", true)
            .attr("x", 30)
            .attr("y", color_y_text)
            .attr("font-size", font_size)
            .attr("fill", "#fff")
            .text("Color")
        ;
        svg_g_q.append("text")
            .classed("color_num", true)
        ;
        svg_g_q.append("path")
            .classed("color_button_up", true)
        ;
        svg_g_q.append("path")
            .classed("color_button_down", true)
        ;
    }
    {
        let depth_y = 100;
        let depth_y_text = depth_y + 40;   // textの下の位置
        svg_g_q.append("text")
            .classed("depth_text", true)
            .attr("x", 30)
            .attr("y", depth_y_text)
            .attr("font-size", font_size)
            .attr("fill", "#fff")
            .text("Depth")
        ;
        svg_g_q.append("text")
            .classed("depth", true)
        ;
        svg_g_q.append("path")
            .classed("depth_button_up", true)
        ;
        svg_g_q.append("path")
            .classed("depth_button_down", true)
        ;
    }
    {
        let empty_y = 170;
        let empty_y_text = empty_y + 40;   // textの下の位置
        svg_g_q.append("text")
            .classed("empty_text", true)
            .attr("x", 30)
            .attr("y", empty_y_text)
            .attr("font-size", font_size)
            .attr("fill", "#fff")
            .text("Empty")
        ;
        svg_g_q.append("text")
            .classed("empty_box", true)
        ;
        svg_g_q.append("path")
            .classed("empty_box_button_up", true)
        ;
        svg_g_q.append("path")
            .classed("empty_box_button_down", true)
        ;
    }
    // ボタン
    {
        svg_g_q.append("rect")
            .attr("x", 520)
            .attr("y", 40)
            .attr("width", 250)
            .attr("height", 160)
            .attr("fill", "#cc3")
        ;
        svg_g_q.append("text")
            .attr("x", 580)
            .attr("y", 140)
            .attr("font-size", font_size)
            .attr("fill", "#333")
            .text("New")
        ;
        svg_g_q.append("path")
            .attr("d", "M 520 40 L 520 200 L 770 200 L 770 40 Z")
            .attr("stroke", "#993")
            .attr("stroke-width", "30")
            .attr("fill", "#f00")
            .attr("fill-opacity", "0.0")
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round")
            .on("click", function(){
                // 問題を作成
                let boxes = [];
                if (game.current_game_mode==1){
                    // playモード
                    boxes = create_question(color_num, depth, empty_box_num);
                }else{
                    // createモード
                    for(let i=0; i<color_num; i++){
                        let box = [];
                        for(let j=0; j<depth; j++){
                            box.push(i);
                        }
                        boxes.push(box);
                    }
                    for(let i=0; i<empty_box_num; i++){
                        boxes.push([]);
                    }
                }
                
                // データからゲームを作成
                game = new Game(boxes, color_num, depth);

                // 要素を全部消す
                d3.selectAll("g.g_boxes").remove();
                d3.selectAll("g.g_balls").remove();
                // 再描画
                init_show_boxes();
            })
        ;
    }

    // 描画
    redraw_q_menu();
}

// 再描画
function redraw_q_menu(){
    let svg_g_q = svg.select("g.q_menu");
    let font_size = 60;
    
    // 色数
    {
        let color_y = 30;
        let color_y_text = color_y + 40;   // textの下の位置
        let max_color = 10;
        let min_color = 3;
        svg_g_q.selectAll("text.color_num")
            .data([color_num])
            .classed("color_num", true)
            .attr("x", 280)
            .attr("y", color_y_text)
            .attr("text-anchor", "end")
            .attr("font-size", font_size)
            .attr("fill", "#fff")
            .text(function(d){return d;})
        ;
        svg_g_q.selectAll("path.color_button_up")
            .data([color_num])
            .classed("color_button_up", true)
            .attr("d", "M 300 "+color_y_text+" L 360 "+color_y_text+" L 330 "+color_y+" Z")
            .attr("stroke", function(d){
                if (d<max_color){
                    return "#f66";
                }
                return "#999";
            })
            .attr("stroke-width", "6")
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round")
            .attr("fill", function(d){
                if (d<max_color){
                    return "#c33";
                }
                return "#aaa";

            })
            .on("click", function(d){
                // 最大まで
                if (d<max_color){
                    color_num++;
                }
                redraw_q_menu();
            })
        ;
        svg_g_q.selectAll("path.color_button_down")
            .data([color_num])
            .classed("color_button_down", true)
            .attr("d", "M 400 "+color_y+" L 460 "+color_y+" L 430 "+color_y_text+" Z")
            .attr("stroke", function(d){
                if (min_color<d){
                    return "#99f";
                }
                return "#999";
            })
            .attr("stroke-width", "6")
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round")
            .attr("fill", function(d){
                if (min_color<d){
                    return "#33c";
                }
                return "#aaa";

            })
            .on("click", function(d){
                // 最小まで
                if (min_color<d){
                    color_num--;
                }
                redraw_q_menu();
            })
        ;
    }

    // 深さ
    {
        let depth_y = 100;
        let depth_y_text = depth_y + 40;   // textの下の位置
        let max_depth = 6;
        let min_depth = 3;
        svg_g_q.selectAll("text.depth")
            .data([depth])
            .classed("depth", true)
            .attr("x", 280)
            .attr("y", depth_y_text)
            .attr("text-anchor", "end")
            .attr("font-size", font_size)
            .attr("fill", "#fff")
            .text(function(d){return d;})
        ;
        svg_g_q.selectAll("path.depth_button_up")
            .data([depth])
            .classed("depth_button_up", true)
            .attr("d", "M 300 "+depth_y_text+" L 360 "+depth_y_text+" L 330 "+depth_y+" Z")
            .attr("stroke", function(d){
                if (d<max_depth){
                    return "#f66";
                }
                return "#999";
            })
            .attr("stroke-width", "6")
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round")
            .attr("fill", function(d){
                if (d<max_depth){
                    return "#c33";
                }
                return "#aaa";

            })
            .on("click", function(d){
                // 最大まで
                if (d<max_depth){
                    depth++;
                }
                redraw_q_menu();
            })
        ;
        svg_g_q.selectAll("path.depth_button_down")
            .data([depth])
            .classed("depth_button_down", true)
            .attr("d", "M 400 "+depth_y+" L 460 "+depth_y+" L 430 "+depth_y_text+" Z")
            .attr("stroke", function(d){
                if (min_depth<d){
                    return "#99f";
                }
                return "#999";
            })
            .attr("stroke-width", "6")
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round")
            .attr("fill", function(d){
                if (min_depth<d){
                    return "#33c";
                }
                return "#aaa";

            })
            .on("click", function(d){
                // 最小まで
                if (min_depth<d){
                    depth--;
                }
                redraw_q_menu();
            })
        ;
    }
    // 空box
    {
        let empty_y = 170;
        let empty_y_text = empty_y + 40;   // textの下の位置
        let max_empty = 2;
        let min_empty = 1;
        svg_g_q.selectAll("text.empty_box")
            .data([empty_box_num])
            .classed("empty_box", true)
            .attr("x", 280)
            .attr("y", empty_y_text)
            .attr("text-anchor", "end")
            .attr("font-size", font_size)
            .attr("fill", "#fff")
            .text(function(d){return d;})
        ;
        svg_g_q.selectAll("path.empty_box_button_up")
            .data([empty_box_num])
            .classed("empty_box_button_up", true)
            .attr("d", "M 300 "+empty_y_text+" L 360 "+empty_y_text+" L 330 "+empty_y+" Z")
            .attr("stroke", function(d){
                if (d<max_empty){
                    return "#f66";
                }
                return "#999";
            })
            .attr("stroke-width", "6")
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round")
            .attr("fill", function(d){
                if (d<max_empty){
                    return "#c33";
                }
                return "#aaa";

            })
            .on("click", function(d){
                // 最大まで
                if (d<max_empty){
                    empty_box_num++;
                }
                redraw_q_menu();
            })
        ;
        svg_g_q.selectAll("path.empty_box_button_down")
            .data([empty_box_num])
            .classed("empty_box_button_down", true)
            .attr("d", "M 400 "+empty_y+" L 460 "+empty_y+" L 430 "+empty_y_text+" Z")
            .attr("stroke", function(d){
                if (min_empty<d){
                    return "#99f";
                }
                return "#999";
            })
            .attr("stroke-width", "6")
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round")
            .attr("fill", function(d){
                if (min_empty<d){
                    return "#33c";
                }
                return "#aaa";

            })
            .on("click", function(d){
                // 最小まで
                if (min_empty<d){
                    empty_box_num--;
                }
                redraw_q_menu();
            })
        ;
    }
}


var color_num = 8;
var depth = 4;
var empty_box_num = 2;
boxes = create_question(color_num, depth, empty_box_num);

// データからゲームを作成
var game = new Game(boxes, color_num, depth);

initialize();
init_show_boxes();
