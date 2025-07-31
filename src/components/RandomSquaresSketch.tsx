'use client';

import React from 'react';
import Sketch from 'react-p5';
import type P5 from 'p5';
import type {
    Image as P5Image
} from 'p5';

export class LimitedList < T > {
    private readonly limit: number;
    private items: T[] = [];

    constructor(limit: number) {
        if (limit <= 0) {
            throw new Error('El límite debe ser un número positivo.');
        }
        this.limit = limit;
    }

    add(item: T): void {
        if (this.items.length >= this.limit) {
            this.items.shift();
        }
        this.items.push(item);
    }

    [Symbol.iterator](): IterableIterator < T > {
        return this.items[Symbol.iterator]();
    }

    getItems(): T[] {
        return this.items;
    }
}
interface RandomSquaresSketchProps {
    className ? : string;
}

interface Dibujable {
    draw(p5: P5): void;
    update(p5: P5): void;
}

var arr = new LimitedList < Cuadrado > (22);
var lin = new LimitedList < Point > (13);
var puntosParaBezier = new LimitedList < Point > (5);
var boids = new LimitedList < Boid > (80);
var nodosTexto = new LimitedList < NodoTexto > (10);

interface Point {
  x: number;
  y: number;
}

class Cuadrado implements Dibujable {
  x: number;
  y: number;
  str: string;
  tam: number;
  oscuro: boolean;
  str_orientacion: boolean;
  lifetime: number;
    constructor(p5: P5, x: number, y: number, str: string) {
        const tamanoMinimo = 20;
        const tamanoMaximo = 70;
        this.x = x;
        this.y = y;
        this.str = str;
        this.tam = p5.floor(p5.random(tamanoMinimo, tamanoMaximo + 1));
        this.oscuro = p5.random() > 0.8;
        this.str_orientacion = p5.random() > 0.5;
        this.lifetime = 255;
        if (p5.random() > 0.5) {
            lin.add({
                x: this.x,
                y: this.y
            });
        }
        if (p5.random() > 0.95) {
            puntosParaBezier.add({
                x: this.x,
                y: this.y
            });
        }
    }
    update(p5: P5): void {
        this.lifetime -= 2.5;
    }
    draw(p5: P5): void {
        if (this.lifetime <= 0) return;
        const alpha = this.lifetime;
        if (this.oscuro) {
            p5.push();
            p5.blendMode(p5.DIFFERENCE);
            p5.fill(255, alpha);
            p5.noStroke();
            p5.rect(this.x, this.y, this.tam, this.tam);
            p5.pop();
        } else {
            p5.noFill();
            p5.stroke(255, 80 * (alpha / 255));
            p5.strokeWeight(1);
            p5.rect(this.x, this.y, this.tam, this.tam);
        }
        p5.push();
        p5.noStroke();
        p5.fill(255, alpha);
        p5.textSize(12);
        p5.textAlign(p5.CENTER, p5.CENTER);
        const posy = this.y + (this.str_orientacion ? -this.tam / 1.5 : this.tam / 1.5);
        p5.text(this.str, this.x, posy);
        p5.pop();
    }
}

class NodoTexto implements Dibujable {
    pos: P5.Vector;texto: string;lifetime: number;
    constructor(p5: P5, x: number, y: number) {
        this.pos = p5.createVector(x, y);
        const textos = ["int main()", "for(;;)", "p->x", "NULL", "0xFA4B21", "mem::transmute"];
        this.texto = p5.random(textos);
        this.lifetime = 255;
    }
    update(p5: P5): void {
        this.lifetime -= 2;
    }
    draw(p5: P5): void {
        if (this.lifetime <= 0) return;
        p5.push();
        p5.textFont('monospace', 10);
        p5.fill(255, this.lifetime);
        p5.noStroke();
        p5.text(this.texto, this.pos.x, this.pos.y);
        p5.pop();
    }
}

// =========================================================================
// CORREGIDO: La clase Boid ahora usa p5.constructor.Vector en lugar de P5.Vector
// =========================================================================
class Boid implements Dibujable {
    position: P5.Vector;
    velocity: P5.Vector;
    acceleration: P5.Vector;
    maxSpeed = 2;maxForce = 0.05;
    constructor(p5: P5, x: number, y: number) {
        this.position = p5.createVector(x, y);
        // CORREGIDO: Usar la instancia `p5` para acceder a métodos estáticos.
        this.velocity = p5.constructor.Vector.random2D();
        this.velocity.setMag(p5.random(1, 2));
        this.acceleration = p5.createVector();
    }

    flock(p5: P5, boids: Boid[]) {
        let separation = this.separate(p5, boids);
        let alignment = this.align(p5, boids);
        let cohesion = this.cohere(p5, boids);
        separation.mult(1.5);
        alignment.mult(1.0);
        cohesion.mult(1.0);
        this.acceleration.add(separation);
        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
    }

    update(p5: P5) {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);
        if (this.position.x > p5.width) this.position.x = 0;
        else if (this.position.x < 0) this.position.x = p5.width;
        if (this.position.y > p5.height) this.position.y = 0;
        else if (this.position.y < 0) this.position.y = p5.height;
    }

    draw(p5: P5) {
        p5.stroke(255);
        p5.strokeWeight(3);
        p5.point(this.position.x, this.position.y);
    }

    seek(p5: P5, target: P5.Vector) {
        // CORREGIDO:
        let desired = p5.constructor.Vector.sub(target, this.position);
        desired.setMag(this.maxSpeed);
        let steer = p5.constructor.Vector.sub(desired, this.velocity);
        steer.limit(this.maxForce);
        return steer;
    }

    separate(p5: P5, boids: Boid[]) {
        let desiredSeparation = 25.0;
        let steer = p5.createVector(0, 0);
        let count = 0;
        for (let other of boids) {
            // CORREGIDO:
            let d = p5.constructor.Vector.dist(this.position, other.position);
            if ((d > 0) && (d < desiredSeparation)) {
                // CORREGIDO:
                let diff = p5.constructor.Vector.sub(this.position, other.position);
                diff.normalize();
                diff.div(d);
                steer.add(diff);
                count++;
            }
        }
        if (count > 0) steer.div(count);
        if (steer.mag() > 0) {
            steer.setMag(this.maxSpeed);
            // CORREGIDO:
            steer.sub(this.velocity);
            steer.limit(this.maxForce);
        }
        return steer;
    }

    align(p5: P5, boids: Boid[]) {
        let neighborDist = 50;
        let sum = p5.createVector(0, 0);
        let count = 0;
        for (let other of boids) {
            let d = p5.constructor.Vector.dist(this.position, other.position);
            if ((d > 0) && (d < neighborDist)) {
                sum.add(other.velocity);
                count++;
            }
        }
        if (count > 0) {
            sum.div(count);
            sum.setMag(this.maxSpeed);
            let steer = p5.constructor.Vector.sub(sum, this.velocity);
            steer.limit(this.maxForce);
            return steer;
        } else {
            return p5.createVector(0, 0);
        }
    }

    cohere(p5: P5, boids: Boid[]) {
        let neighborDist = 50;
        let sum = p5.createVector(0, 0);
        let count = 0;
        for (let other of boids) {
            let d = p5.constructor.Vector.dist(this.position, other.position);
            if ((d > 0) && (d < neighborDist)) {
                sum.add(other.position);
                count++;
            }
        }
        if (count > 0) {
            sum.div(count);
            return this.seek(p5, sum);
        } else {
            return p5.createVector(0, 0);
        }
    }
}

let bgGif: P5Image;

const RandomSquaresSketch: React.FC < RandomSquaresSketchProps > = (props) => {
    const setup = (p5: P5, canvasParentRef: HTMLElement) => {
        p5.createCanvas(canvasParentRef.clientWidth, canvasParentRef.clientHeight).parent(canvasParentRef);
        p5.colorMode(p5.HSB, 360, 100, 100, 100);
        p5.rectMode(p5.CENTER);
        p5.frameRate(30);
        bgGif = p5.loadImage('/gif.gif');
        for (let i = 0; i < boids.limit; i++) {
            boids.add(new Boid(p5, p5.random(p5.width), p5.random(p5.height)));
        }
    };

    const draw = (p5: P5) => {
        if (bgGif && bgGif.width > 0) {
            p5.background(bgGif);
        } else {
            p5.background(10, 20, 40);
        }

        for (var i = 0; i < 2; i++) {
            const spawnRadius = 250;
            const x = p5.random(p5.mouseX - spawnRadius, p5.mouseX + spawnRadius);
            const y = p5.random(p5.mouseY - spawnRadius, p5.mouseY + spawnRadius);
            const num = p5.round(p5.random(700, 900));
            arr.add(new Cuadrado(p5, x, y, `${num}`));
            if (p5.random() > 0.95) nodosTexto.add(new NodoTexto(p5, x, y));
        }

        for (const cua of arr) {
            cua.update(p5);
            cua.draw(p5);
        }
        for (const nodo of nodosTexto) {
            nodo.update(p5);
            nodo.draw(p5);
        }
        for (const boid of boids) {
            boid.flock(p5, boids.getItems());
            boid.update(p5);
            boid.draw(p5);
        }

        p5.stroke(255);
        p5.strokeWeight(1);
        var pre: Point | undefined;
        for (const l of lin) {
            if (pre) {
                p5.line(l.x, l.y, pre.x, pre.y);
            }
            pre = l;
        }

        const puntosCurva = puntosParaBezier.getItems();
        if (puntosCurva.length >= 2) {
            p5.noFill();
            const dibujarCurvaCaotica = () => {
                p5.beginShape();
                p5.vertex(puntosCurva[0].x, puntosCurva[0].y);
                for (let i = 0; i < puntosCurva.length - 1; i++) {
                    const p0 = puntosCurva[i];
                    const p1 = puntosCurva[i + 1];
                    const controlDist = 80;
                    const cx1 = p0.x + p5.random(-controlDist, controlDist);
                    const cy1 = p0.y + p5.random(-controlDist, controlDist);
                    const cx2 = p1.x + p5.random(-controlDist, controlDist);
                    const cy2 = p1.y + p5.random(-controlDist, controlDist);
                    p5.bezierVertex(cx1, cy1, cx2, cy2, p1.x, p1.y);
                }
                p5.endShape();
            };
            p5.stroke(255, 30);
            p5.strokeWeight(7);
            dibujarCurvaCaotica();
            p5.stroke(255, 100);
            p5.strokeWeight(2);
            dibujarCurvaCaotica();
        }
    };
    return < Sketch setup = {setup } draw = {draw} className = {props.className }/>;
};
export default RandomSquaresSketch;
