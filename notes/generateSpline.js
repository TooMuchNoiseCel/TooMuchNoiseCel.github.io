// generateSpline.js
const THREE = require('three');
const fs = require('fs');

// Copia las funciones y parámetros necesarios de tu componente
function drawCircleAroundPoint(origin, rotation, armLength, step, numPoints, frequency) {
    const angleStep = (Math.PI * 2) / numPoints;
    const angle = step * angleStep * frequency;
    const localPoint = new THREE.Vector3(armLength * Math.cos(angle), armLength * Math.sin(angle), 0);
    const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(rotation);
    const rotatedPoint = localPoint.clone().applyMatrix4(rotationMatrix);
    return rotatedPoint.clone().add(origin);
}

function calculateSplinePoints(arms) {
    const points = [];
    const numPoints = 1000;
    for (let step = 0; step <= numPoints; step++) {
        let currentOrigin = new THREE.Vector3(0, 0, 0);
        arms.forEach(arm => {
            currentOrigin = drawCircleAroundPoint(currentOrigin, arm.rotation, arm.length, step, numPoints, arm.frequency);
        });
        // Guardamos como arrays para que sea serializable a JSON
        points.push(currentOrigin.toArray()); 
    }
    return points;
}

const arms = [
    { length: 0.36, rotation: new THREE.Euler(0, 0, 0), frequency: 1 },
    { length: 0.43, rotation: new THREE.Euler(1.66, 0, 0), frequency: 4 },
    { length: 0.19, rotation: new THREE.Euler(3.68, 1.54, 1.71), frequency: 5 },
];

const splinePoints = calculateSplinePoints(arms);

// Guarda los puntos en un archivo JSON en la carpeta public
fs.writeFileSync('./public/spline-points.json', JSON.stringify(splinePoints));

console.log('✅ Puntos de la curva guardados en public/spline-points.json');
