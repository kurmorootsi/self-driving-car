const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
const scoreHtml = document.getElementById("score");

const totalCars = document.getElementById("totalCars");
const carsDestroyed = document.getElementById("carsDestroyed");
const carsLeft = document.getElementById("carsLeft");

networkCanvas.width = 700;

const carContext = carCanvas.getContext("2d");
const networkContext = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9)

const N = 1;

totalCars.textContent = N.toString();
carsLeft.textContent = N.toString();

const cars = generateCars(N);
let bestCar = cars[0];

if (localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain")
        );

        if (i !== 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.1);
        }
    }

    bestCar.brain = JSON.parse(
        localStorage.getItem("bestBrain")
    );
}

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -800, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -1000, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -1100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -1200, 30, 50, "DUMMY", 2),
];

new Car(road.getLaneCenter(2), 100, 30, 50, "KEYS")


animate();

function save() {
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain))
}

function discard() {
    localStorage.removeItem("bestBrain");
}

function generateCars(N) {
    const cars = [];

    for (let i = 1; i <= N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }

    return cars;
}

function animate(time) {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }

    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }

    bestCar = cars.find(
        c => c.y === Math.min(
            ...cars.map(c => c.y)
        )
    );

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight * 0.75;
    carContext.save();
    carContext.translate(0, -bestCar.y + carCanvas.height * 0.7);
    road.draw(carContext);

    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carContext, "blue");
    }

    carContext.globalAlpha = 0.2;

    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carContext, "black");
    }

    carContext.globalAlpha = 1;

    bestCar.draw(carContext, "black", true);

    scoreHtml.textContent = bestCar.score;

    carContext.restore();

    Visualizer.drawNetwork(networkContext, bestCar.brain);
    requestAnimationFrame(animate)
}