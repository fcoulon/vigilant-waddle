class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}


class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    size() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    resize(newSize) {
        let norm = this.getNormalized();
        this.x = norm.x * newSize;
        this.y = norm.y * newSize;
    }

    getNormalized() {
        if(this.size() == 0) {
            return new Vector(0,0);
        }

        let newX = this.x / this.size();
        let newY = this.y / this.size();
        return new Vector(newX, newY);
    }

    getNormal() {
        let normalized = this.getNormalized();
        return new Vector(normalized.y, -normalized.x);
    }

    getAntiNormal() {
        let normalized = this.getNormalized();
        return new Vector(-normalized.y, normalized.x);
    }

    translate(point) {
        return new Point(point.x + this.x, point.y + this.y);
    }

    //Clockwise
    rotate(angle) {
        let norm = this.getNormalized();
        let currentAngle = Math.acos(norm.x);
        if(norm.y < 0) {
            currentAngle = - currentAngle;
        }
        let newAngle = angle + currentAngle;
        norm.x = Math.cos(newAngle);
        norm.y = Math.sin(newAngle);
        norm.resize(this.size());
        this.x = norm.x;
        this.y = norm.y;
    }

    static distance(pointA, pointB) {
        let vect = new Vector(pointB.x - pointA.x, pointB.y - pointA.y);
        return vect.size();
    }
}
