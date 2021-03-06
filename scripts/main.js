//const BST = require("../scripts/BinarySearchTree");
const PIXI = require('pixi.js'); // the graphic engine
const Viewport = require('pixi-viewport').Viewport; // the dynamic background
const gsap = require("gsap");

// give the plugin a reference to the PIXI object

const app = new PIXI.Application({
    height : window.innerHeight - 53,
    width : window.innerWidth,
    antialias : true,
    transparent : true,
    resolution : 1
});

document.body.appendChild(app.view)
app.view.style.position = 'absolute';
app.view.style.left = '50%';
app.view.style.top = '52.0%';
app.view.style.transform = 'translate3d( -50%, -50%, 0 )';

const viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: 10000,
    worldHeight: 10000,

    interaction: app.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
});

// add the viewport to the stage
app.stage.addChild(viewport);

// activate plugins
viewport
    .drag()
    .pinch()
    .wheel()
    .decelerate();

/*
The above is the template part. If you want to add new data structure, you can add your code below. Since PIXI requires importing locally ( it can't be
imported from www.unpkg.com currently ), you need to browsify this file. That is why adding some additional files for clarification and readability may make
some trouble later. Please use this template.

Format:

{name of the data structure}.js
browsify scripts/{name of the data structure}.js > bundle_{name of the data structure}.js

then use the template html file and import this js file there.

*/

/* Binary Search Tree */

// CONSTANTS ARE HERE



// TODO - depthe göre boyut
// TODO - root baz alınarak yeniden boyutlama
COLOR_CONSTANTS = {
    node: 0xff0000,
    text: 0xffffff,
    edge: 'black'
};
SIZE_CONSTANTS = {
    radius: 20
};


class BinarySearchTreeNode {
    constructor(myparent, myval, myviewport, mypos, myleft = null, myright = null) {
        this.out = {
            parent: myparent,
            leftChild: myleft,
            leftEdge: null,
            rightChild: myright,
            rightEdge: null, 
        };
        this.in = {
            val: myval,
            viewport: myviewport,
            circle: null,
            pos: mypos
        };
        this.in.circle = this.draw_node(mypos);
    }

    draw_node(pos, color = COLOR_CONSTANTS.node, mytext = this.in.val) {
        let circle = new PIXI.Graphics();
        circle.lineStyle(2, color);
        circle.beginFill(color);
        circle.position.set(...pos);
        circle.drawCircle(0, 0, SIZE_CONSTANTS.radius);
        circle.endFill();
        this.in.viewport.addChild(circle);
        let style = new PIXI.TextStyle({ fill: [COLOR_CONSTANTS.text] });
        let txt = new PIXI.Text(mytext.toString(), style);
        txt.anchor.set(0.5);
        circle.addChild(txt);
        return circle;

    }

    draw_edge(toPos) {
        let line = new PIXI.Graphics();
        this.out.leftChild = line;
        line.lineStyle(2, COLOR_CONSTANTS.edge).beginFill();
        var points = this.calc_line_coor(this.pos[0], this.pos[1], toPos[0], toPos[1], SIZE_CONSTANTS.radius);
        line.position.set(points[0], points[1]);
        line.lineTo(points[2] - points[0], points[3] - points[1]);
        this.in.viewport.addChild(line);
    }

    calc_line_coor(x1, y1, x2, y2, radius) {
        var hypotenuse = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);

        var bottom = (x2 - x1);
        var side = (y2 - y1);

        var cosinus = bottom / hypotenuse;
        var sinus = side / hypotenuse;


        var result = [
            x1 + radius * cosinus,
            y1 + radius * sinus,
            x2 - radius * cosinus,
            y2 - radius * sinus
        ];

        return result;

    }
}

class BinarySearchTree {
    constructor(myviewport) {
        this.root = null;
        this.root_pos = [window.innerWidth/2,100];
        this.viewport = myviewport
    }

    add_node(_val) {
        if(this.root === null) { // base case
            this.root = new BinarySearchTreeNode(null,_val,this.viewport,this.root_pos,null,null);
            this.root.draw_node(this.root_pos);
            console.log("root");
        } else {
            let curr = this.root;
            while(curr !== null)
            {
                if(curr.val > _val) {
                    if(curr.left === null) { // insert here
                        let curr_pos = curr.get_pos();
                        let new_node_post = [ curr_pos[0] - 100, curr_pos[1] + 100 ];
                        curr.left = new BinarySearchTreeNode(curr, _val, this.viewport,new_node_post , null, null);
                        curr.left.draw_node(new_node_post);
                        curr.draw_edge(new_node_post);
                        break;
                    }
                    curr = curr.left;
                } else {
                    if(curr.right === null) {
                        let curr_pos = curr.get_pos();
                        let new_node_post = [curr_pos[0] + 100, curr_pos[1] + 100];
                        curr.right = new BinarySearchTreeNode(null, _val, this.viewport, new_node_post, null, null);
                        curr.right.draw_node(new_node_post);
                        curr.draw_edge(new_node_post);
                        break;
                    }

                    curr = curr.right;
                }
            }
        }
    }
}


var tree = new BinarySearchTree(viewport);



document.getElementById('add_input').addEventListener('keypress', function (event) {
    if (event.keyCode === 13) {
        console.log("here");
        tree.add_node(parseInt(document.getElementById("add_input").value));
        document.getElementById("add_form").reset();
        event.preventDefault();
    }
});
document.getElementById('search_input').addEventListener('keypress', function (event) {
    if (event.keyCode === 13) {
        document.getElementById("search_form").reset();
        gsap.TweenLite.to(tree.root.in.circle,{ x: 100, duration: 1 } );
        event.preventDefault();
    }
});
document.getElementById('delete_input').addEventListener('keypress', function (event) {
    if (event.keyCode === 13) {
        console.log(document.getElementById("delete_input").value);
        document.getElementById("delete_form").reset();
        event.preventDefault();
    }
});