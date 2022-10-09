// テストデータ(左が底)
var boxes = [
    [0,0,1,1],
    [1,2,0,2],
    [0,2,1,2],
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
        .on("click", function(d, i){
            move_ball(i);
        })
    ;
}

initialize();
init_show_boxes();
