// テストデータ(左が底)
var boxes = [
    [1,1,2,2],
    [2,3,1,3],
    [1,3,2,3],
];

// 固定値
// ボールの直径
var BALL_D = 100;
// 番号に対する色
var COLORS10 = [
    "#17becf","#bcbd22","#7f7f7f","#e377c2","#8c564b",
    "#9467bd","#d62728","#2ca02c","#ff7f0e","#1f77b4",
];
//var COLORS10 = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ffffff","#00ffff", "#ff00ff", "#000000", "#66ff00", "#0066ff"];

// 初期処理
var svg = null;
//svg領域の大きさ
var svgheight = 2500, svgwidth = 1100;
var init_boxes = deep_copy(boxes);
function initialize(){
    // body
    d3.select("body").style("background-color", "#333");

    // svg
    svg = d3.select("svg")
        .style("font-family", "'ヒラギノ角ゴ Pro W3',Hiragino Kaku Gothic Pro,'メイリオ',Meiryo,Osaka,'ＭＳ Ｐゴシック',MS PGothic,sans-serif")
    ;
}

// 描画
function show_boxes(){
    let svg_g_box = svg.append("g");

    // box
    let box_capacity = init_boxes[0].length;     // max入れられるボールの数
    let box_padding = 20;
    let ball_padding = 8;
    let svg_boxes = svg_g_box.selectAll(".box")
        .data(boxes)
        .enter()
        .append("polyline")
        .attr("class", "box")
        .attr("points", function(d, i){
            let px = get_x_pos(i);
            let py = get_y_pos(i);
            let points = [
                px-box_padding, py-box_padding,
                px-box_padding, py+BALL_D*box_capacity+ball_padding*(box_capacity-1)+box_padding,
                px+BALL_D+box_padding, py+BALL_D*box_capacity+ball_padding*(box_capacity-1)+box_padding,
                px+BALL_D+box_padding, py-box_padding,
            ];
            return points.join(',');
        })
        .attr("stroke", "#555")
        .attr("stroke-width", "20px")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("fill", "none")
    ;

    // ボール
    for(let i=0; i<boxes.length; i++){
        let box = boxes[i]
        let box_px = get_x_pos(i);
        let box_py = get_y_pos(i);

        let svg_g_ball = svg.append("g");
        let svg_ball = svg_g_ball.selectAll(".ball")
            .data(box)
            .enter()
            .append("circle")
            .attr("r", BALL_D/2)
            .attr("cx", box_px + BALL_D/2)
            .attr("cy", function(d, j){
                // 0:底, ...
                return box_py + BALL_D*box_capacity + ball_padding*(box_capacity-1)
                    - (BALL_D+ball_padding)*j - BALL_D/2;
            })
            .attr("fill", function(d){
                return COLORS10[d-1]
            })
        ;
    };
}
// boxのiによる位置を返す
function get_x_pos(box_i){
    return (box_i%4)*250 + 100;
}
function get_y_pos(box_i){
    return BALL_D + 300 + Math.floor(box_i/4) * 700;
}


function get_ball(){

}

// ２次元配列のディープコピー
function deep_copy(matrix){
    const result = [];
    for (const line of matrix) {
        result.push([...line]);
    }
    return result;
}

initialize();
show_boxes();
