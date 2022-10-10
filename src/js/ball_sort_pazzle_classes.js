/*
ball sort pazzleのboxとballの情報を持つクラス
*/

// ゲーム全体の状況
class Game{
    // 初期値
    #init_boxes_value = [];
    // Boxインスタンス
    #boxes = [];
    // boxのindexの最後
    #max_box_index = -1;
    // ballのindexの最後
    #max_ball_index = -1;

    // ゲームモード
    #current_mode = 1;  // [0:create, 1:play]
    get current_game_mode(){return this.#current_mode;}
    switch_game_mode(){
        this.#current_mode = 1 - this.#current_mode;
        return this.#current_mode;
    }

    // 表示系の情報
    static box_stroke_color = "#555";
    static box_stroke_width = "20px";
    static box_linecap = "round";
    static box_linejoin = "round";
    static box_fill  = "#fff";  // ダミー
    static box_fill_opacity = "0.0";    // クリックを捉えるために透過100%

    // Box間の距離、初期値
    static box_left = 100;
    static box_top = 400;
    static box_distance_x = 250;    // 左端での距離
    static box_distance_y = 500;    // 上端での距離
    static box_wrap_num = 4;        // 折り返しのbox個数

    // Box内の隙間
    static box_padding = 20;
    static ball_padding = 8;
    static ball_hover_height = 200;

    // Ballの情報
    static ball_d = 100;
    static ball_colors10 = [
        "#17becf","#bcbd22","#7f7f7f","#e377c2","#8c564b",
        "#9467bd","#d62728","#2ca02c","#ff7f0e","#1f77b4",
    ];

    // 移動
    static move_speed = 100;
    static move_speed_fast = 15;

    // コンストラクタ
    constructor(_init_boxes_value){
        // 初期配置と今の状態を記録、capacityも取得
        this.#init_boxes_value = [];
        this.#boxes = [];
        for(let i=0; i<_init_boxes_value.length; i++){
            let line = _init_boxes_value[i];

            // 初期値を記録
            this.#init_boxes_value.push([...line]);

            // Boxの位置を計算
            let box_x = Game.box_left + (i%Game.box_wrap_num)*Game.box_distance_x;
            let box_y = Game.box_top + Math.floor(i/Game.box_wrap_num) * Game.box_distance_y;

            // Boxインスタンスを生成
            this.#boxes.push(new Box(this, [...line], box_x, box_y, _init_boxes_value[0].length));
        }
    }

    get_boxes(){
        return this.#boxes;
    }

    get_balls(){
        let ret_balls = [];
        //for(let i=0; i<this.#boxes.length; i++){
        this.#boxes.forEach(box=>{
            ret_balls = ret_balls.concat(box.balls);
        })
        return ret_balls;
    }

    get_box(box_i){
        return this.#boxes[i];
    }

    regist_box_index(){
        return ++this.#max_box_index;
    }
    regist_ball_index(){
        return ++this.#max_ball_index;
    }

    // インスタンス内でballを移動する
    move_ball(source_box_index, dest_box_index){
        let ball = this.#boxes[source_box_index].balls.pop();
        this.#boxes[dest_box_index].balls.push(ball);
    }
}

// Box
class Box{
    #box_index = -1;
    get box_index(){return this.#box_index;}
    #game_ins = null;
    get game_ins(){return this.#game_ins;}
    #balls = [];
    get balls(){return this.#balls;}
    get balls_len(){return this.#balls.length;}
    #box_capacity = -1;
    get box_capacity(){return this.#balls.length;}
    
    #pos_x = 0;
    get pos_x(){return this.#pos_x;}
    #pos_y = 0;
    get pos_y(){return this.#pos_y;}

    // 一番上のballを返す
    get top_ball(){
        if (this.#balls.length==0){
            // １つも入っていない
            return null;
        }
        return this.#balls[this.#balls.length-1];
    }

    // コンストラクタ
    constructor(game_ins, balls, pos_x, pos_y, capa){
        this.#box_index = game_ins.regist_box_index();
        this.#game_ins = game_ins;
        this.#balls = [];
        this.#pos_x = pos_x;
        this.#pos_y = pos_y;
        this.#box_capacity = capa;

        for(let i=0; i<balls.length; i++){
            let ball_pos_x = this.get_ball_pos_x();
            let ball_pos_y = this.get_ball_pos_y(i);

            // ballインスタンスを生成
            this.#balls.push(new Ball(this, balls[i], ball_pos_x, ball_pos_y));
        }
    }

    // points
    get points_str(){
        let px = this.#pos_x;
        let py = this.#pos_y;
        
        let left = px;
        let right = px + Game.ball_d + Game.box_padding*2;
        let top = py - Game.box_padding;
        let bottom = py + Game.ball_d*this.#box_capacity
            + Game.ball_padding*(this.#box_capacity-1)
            + Game.box_padding;
        
        let points = [
            left, top,
            left, bottom,
            right, bottom,
            right, top
        ];
        return points.join(",");
    }

    get_ball_pos_x(){
        return this.#pos_x + Game.box_padding + Game.ball_d/2;
    }
    get_ball_pos_y(ball_pos_i){
        return (
            this.#pos_y
            + Game.ball_d * this.#box_capacity
            + Game.ball_padding * (this.#box_capacity-1)
            - (Game.ball_d+Game.ball_padding)*ball_pos_i
            - Game.ball_d/2
        );
    }

    // ball_noを受け入れることができるか
    is_acceptable_ball(ball_no){
        // 空ならOK
        if (this.#balls.length==0){
            return true;
        }

        // キャパオーバーの場合はNG
        if (this.#box_capacity <= this.#balls.length){
            return false;
        }

        // トップの色が違っていたらNG
        if (this.top_ball.ball_no != ball_no){
            return false;
        }

        return true;
    }
}

// Ball
class Ball{
    #box_ins = null;
    get box_ins(){return this.#box_ins;}

    // ballの値
    #ball_no = -1;
    get ball_no(){return this.#ball_no;}

    // ballの通し番号
    #ball_index = -1;

    #pos_cx = 0;
    #pos_cy = 0;

    // コンストラクタ
    constructor(box_ins, ball_no, pos_cx, pos_cy){
        this.#box_ins = box_ins;
        this.#ball_no = ball_no;
        this.#pos_cx = pos_cx;
        this.#pos_cy = pos_cy;
        this.#ball_index = this.#box_ins.game_ins.regist_ball_index();
    }

    // 中心の座標を返す
    get cx(){
        return this.#pos_cx;
    }
    get cy(){
        return this.#pos_cy;
    }

    // 色
    get color(){
        return Game.ball_colors10[this.#ball_no];
    }

    get ball_index(){
        return this.#ball_index;
    }
}
