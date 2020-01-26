
var isIE = document.all ? true : false;
var ticker = 10;
var pack = new Array();
var Pi = 3.141592654;
var _pending = null;

class Ball {
    constructor(img_map, ncol, nrow, ix, iy, start_cell, end_cell) {
        this.img_map = 'art/' + img_map;
        this.cx = Math.floor(ix / ncol);
        this.cy = Math.floor(iy / nrow);
        this.ncol = ncol;
        this.nrow = nrow;
        this.ix = ix;
        this.iy = iy;
        this.ticker = 0;
        this.cell = start_cell;
        this.start_cell = start_cell;
        this.end_cell = (end_cell == 0) ? nrow * ncol - 1 : end_cell;

        this.x = 0;
        this.y = 0;
        this.dx = 1;
        this.dy = 1;
        this.minx = 25;
        this.miny = 25;
        this.maxx = this.minx + 900;
        this.maxy = this.miny + 900;
        this.ctrx = Math.floor((this.maxx - this.minx) / 2);
        this.ctry = Math.floor((this.maxy - this.miny) / 2);
        this.radius = 0;
        this.max_radius = (this.maxx - this.minx) / 2;
        this._init = 0;
        this._isdead = 0;
        this.lifespan = Math.floor(Math.random() * (2000 - 400) + 400);
        this.path = Math.floor(Math.random() * 2 + 1);
    }

    create() {
        var r, g, b, cx;
        r = Math.floor(Math.random() * 255);
        g = Math.floor(Math.random() * 255);
        b = Math.floor(Math.random() * 255);

        this.x = Math.floor(Math.random() * (this.maxx - this.minx) + this.minx);
        this.y = Math.floor(Math.random() * (this.maxy - this.miny) + this.miny);
        this.dx = Math.floor(Math.random() * 4 - 2); // -3 .. 3
        this.dy = Math.floor(Math.random() * 4 - 2); // -3 .. 3

        this.calc_radius();

        this.name = "foo" + ticker++;
        this.color = 'rgb(' + r + ',' + g + ',' + b + ')';
        document.body.innerHTML += '<div class="foo-div" '
            + 'id="' + this.name + '" '
            + 'style="background: url(' + this.img_map + ') 0 0; width: ' + this.cx + 'px; height: ' + this.cy + 'px;"'
            //                            + 'style="background-color: '+ this.color + '; width: ' + this.cx + 'px; height: ' + this.cy + 'px;"' 
            + '>'
            + '</div>';
    }

    anchor() {
        this.x = this.ctrx;
        this.y = this.ctry;
        this.radius = 0;
    }

    calc_radius() {
        var dx, dy;
        dx = this.x - this.ctrx;
        dy = this.y - this.ctry;
        this.radius = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        this.alpha = Math.atan2(dy, dx) * (180 / Pi);
    }

    die() {
        this._isdead = 1;
        this.obj.style.top = 200;
        this.obj.remove();
    }

    doMove() {
        if (this._init != 1) this.init();

        this.update_position();

        this.obj.style.left = this.x + 2 + 'px';
        this.obj.style.top = this.y + 2 + 'px';

        this.ticker++;
        if ((this.ticker % 5) == 0) {
            this.cell = (this.cell + 1);
            if (this.cell > this.end_cell)
                this.cell = this.start_cell;
            var x = (this.cell % this.ncol) * this.cx;
            var y = Math.floor((this.cell / this.nrow)) * this.cy;
            this.obj.style.backgroundPosition = x + 'px ' + y + "px";
        }
    }

    init() {
        this.obj = document.getElementById(this.name);

        var x = (this.cell % this.ncol) * this.cx;
        var y = (this.cell % this.nrow) * this.cy;
        this.obj.style.backgroundPosition = x + 'px ' + y + "px";
        this._init = 1;
    }

    twitch() {
        this.doMove();
        this.lifespan--;
        if (this.lifespan <= 0) this.die();
    }

    update_position() {
        if (this.path == 1)
            this.simple_bounce();
        else
            this.simple_orbit();
    }

    simple_bounce() {
        this.x += this.dx;
        if (this.x < this.minx) {
            this.dx *= -1;
            this.x = this.minx;
        }
        else if (this.x > this.maxx) {
            this.dx *= -1;
            this.x = this.maxx;
        }

        this.y += this.dy;
        if (this.y < this.miny) {
            this.dy *= -1;
            this.y = this.miny;
        }
        else if (this.y > this.maxy) {
            this.dy *= -1;
            this.y = this.maxy;
        }
    }

    simple_orbit() {
        this.alpha += this.dx;
        if (this.alpha > 360) this.alpha = 0;

        this.radius += this.dy;
        if (this.radius < 10) {
            this.dy *= -1;
            this.radius = 10;
        }
        else if (this.radius > this.max_radius) {
            this.dy *= -1;
            this.radius = this.max_radius;
        }

        this.x = this.minx + this.ctrx + Math.floor(this.radius * Math.cos(this.alpha * Pi / 180));
        this.y = this.miny + this.ctry + Math.floor(this.radius * Math.sin(this.alpha * Pi / 180));
    }
}

function twitch() {
    for (var i = 0; i < pack.length; i++)
        pack[i].twitch();

    // clear out the dead
    if (pack.length > 0) {
        for (var i = pack.length - 1; i >= 0; i--) {
            if (pack[i]._isdead == 1)
                pack.splice(i, 1);
        }
    }
    setTimeout(twitch, 20);
}

function init() {
    var b;
    var x;
    for (var i = 0; i < 100; i++) {
        x = Math.floor(Math.random() * 16 + 1);
        switch (x) {
            case 1: b = new Ball('image11.png', 10, 1, 160, 16, 0, 0); break;
            case 2: b = new Ball('image15.png', 10, 1, 160, 16, 0, 0); break;
            case 3: b = new Ball('rock2.png', 10, 3, 320, 96, 0, 0); break;
            case 4: b = new Ball('image1.png', 10, 13, 160, 208, 0, 9); break;
            case 5: b = new Ball('image1.png', 10, 13, 160, 208, 10, 19); break;
            case 6: b = new Ball('image1.png', 10, 13, 160, 208, 20, 29); break;
            case 7: b = new Ball('image1.png', 10, 13, 160, 208, 30, 39); break;
            case 8: b = new Ball('image1.png', 10, 13, 160, 208, 40, 49); break;
            case 9: b = new Ball('image1.png', 10, 13, 160, 208, 50, 59); break;
            case 10: b = new Ball('image1.png', 10, 13, 160, 208, 60, 69); break;
            case 11: b = new Ball('image1.png', 10, 13, 160, 208, 70, 79); break;
            case 12: b = new Ball('image1.png', 10, 13, 160, 208, 80, 89); break;
            case 13: b = new Ball('image1.png', 10, 13, 160, 208, 90, 99); break;
            case 14: b = new Ball('image1.png', 10, 13, 160, 208, 100, 109); break;
            case 15: b = new Ball('rock3.png', 15, 2, 240, 32, 0, 0); break;
            case 16: b = new Ball('image3.png', 10, 2, 160, 32, 0, 9); break;
            case 17: b = new Ball('image3.png', 10, 2, 160, 32, 10, 19); break;
        }
        b.create();
        pack.push(b);
    }

    twitch();
}

