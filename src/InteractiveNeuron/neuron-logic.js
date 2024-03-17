
export class Neuron {
    constructor(x, y, bias, size) {
        this.x = x;
        this.y = y;
        this.bias = bias;
        this.size = size;
        this.element = this.createNeuronElement();
        this.activationBar = this.createActivationBar();
    }

    createNeuronElement() {
        const neuron = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        );
        neuron.setAttribute("x", this.x - this.size / 2);
        neuron.setAttribute("y", this.y - this.size / 2);
        neuron.setAttribute("width", this.size);
        neuron.setAttribute("height", this.size);
        neuron.setAttribute("rx", this.size / 10);
        neuron.setAttribute("ry", this.size / 10);
        neuron.setAttribute("fill", "white");
        neuron.setAttribute("stroke", "black");
        return neuron;
    }

    createActivationBar() {
        const activationBar = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        );
        activationBar.setAttribute("x", this.x - this.size / 2 + 5);
        activationBar.setAttribute("y", this.y + this.size / 2 + 5);
        activationBar.setAttribute("width", this.size - 10);
        activationBar.setAttribute("height", 0);
        activationBar.setAttribute("rx", 5);
        activationBar.setAttribute("ry", 5);
        activationBar.setAttribute("fill", "black");
        return activationBar;
    }

    updateActivation(inputValues) {
        const weightedSum = inputValues.reduce((sum, value) => sum + value, this.bias);
        const activation = Math.tanh(weightedSum);
        console.log(activation);
        const barHeight = activation * this.size;
        this.activationBar.setAttribute(
            "y",
            this.y + this.size / 2 - 5 - barHeight
        );
        this.activationBar.setAttribute("height", barHeight);
    }
}

export class Input {
    constructor(x, y, size, name, weight, network) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.name = name;
        this.weight = weight;
        this.element = this.createInputElement();
        this.label = this.createLabelElement();
        this.stateLabel = this.createStateLabelElement();
        this.state = false;
        this.network = network;
    }

    createInputElement() {
        const input = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        );
        input.setAttribute("x", this.x - this.size / 2);
        input.setAttribute("y", this.y - this.size / 2);
        input.setAttribute("width", this.size);
        input.setAttribute("height", this.size);
        input.setAttribute("rx", this.size / 4);
        input.setAttribute("ry", this.size / 4);
        input.setAttribute("fill", "white");
        input.setAttribute("stroke", "black");
        input.setAttribute("cursor", "pointer");
        input.addEventListener("click", () => this.onClick());
        return input;
    }

    onClick() {
        this.state = !this.state;
        this.updateInputState();
        this.updateNetwork();
    }

    createLabelElement() {
        const label = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );
        label.textContent = this.name;
        label.setAttribute("x", this.x);
        label.setAttribute("y", this.y + this.size / 2 + 20);
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("class", "input-label");
        return label;
    }

    createStateLabelElement() {
        const stateLabel = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );
        stateLabel.textContent = "off";
        stateLabel.setAttribute("x", this.x);
        stateLabel.setAttribute("y", this.y);
        stateLabel.setAttribute("text-anchor", "middle");
        stateLabel.setAttribute("alignment-baseline", "middle");
        stateLabel.setAttribute("class", "state-label");
        stateLabel.setAttribute("fill", "black");
        stateLabel.setAttribute("cursor", "pointer");
        stateLabel.addEventListener("click", () => this.onClick());
        return stateLabel;
    }

    updateInputState() {
        this.element.setAttribute("fill", this.state ? "black" : "white");
        this.stateLabel.textContent = this.state ? "on" : "off";
        this.stateLabel.setAttribute("fill", this.state ? "white" : "black");
    }

    updateNetwork() {
        this.network.updateNetwork();
    }
}

export class Network {
    constructor(svg) {
        this.svg = svg;
        this.inputs = [];
        this.neurons = [];
        this.connections = [];
    }

    addInput(x, y, size, name, weight) {
        const input = new Input(x, y, size, name, weight, this);
        this.inputs.push(input);
        this.svg.appendChild(input.element);
        this.svg.appendChild(input.label);
        this.svg.appendChild(input.stateLabel);
    }

    updateNetwork() {
        const inputValues = this.inputs.map((input) =>
            input.state ? input.weight : 0
        );
        this.neurons.forEach((neuron) => neuron.updateActivation(inputValues));
        this.updateConnectionColors();
    }

    addNeuron(x, y, bias, size) {
        const neuron = new Neuron(x, y, bias, size, this);
        this.neurons.push(neuron);
        this.svg.appendChild(neuron.element);
    }

    addConnection(input, neuron) {
        const connection = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );
        connection.setAttribute("x1", input.x);
        connection.setAttribute("y1", input.y - input.size / 2);
        connection.setAttribute("x2", neuron.x);
        connection.setAttribute("y2", neuron.y + neuron.size / 2);
        connection.setAttribute("stroke", input.weight >= 0 ? "green" : "purple");
        connection.setAttribute("stroke-width", 2);
        this.connections.push(connection);
        this.svg.appendChild(connection);
    }

    updateConnectionColors() {
        this.connections.forEach((connection, index) => {
            const input = this.inputs[index];
            connection.setAttribute("stroke", input.weight >= 0 ? "green" : "purple");
        });
    }
}
