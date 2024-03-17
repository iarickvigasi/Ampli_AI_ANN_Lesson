import React, { useEffect, useRef } from 'react';
import { Neuron, Input, Network } from './neuron-logic';

const InteractiveNeuronChester = () => {
    const networkRef = useRef(null);

    useEffect(() => {
        const networkSVG = networkRef.current;
        const network = new Network(networkSVG);

        const inputNames = ["Спина", "Вушка", "Лапки", "Животик"];
        const inputWeights = [0.3, 0.3, -0.3, 0.4];

        inputNames.forEach((name, index) => {
            network.addInput(80 + index * 80, 240, 60, name, inputWeights[index]);
        });

        network.addNeuron(190, 100, 0.3, 80 );

        network.inputs.forEach((input) => {
            network.addConnection(input, network.neurons[0]);
        });

        network.neurons.forEach((neuron) => {
            networkSVG.appendChild(neuron.activationBar);
        });

        network.updateNetwork();

        return () => {
            networkSVG.innerHTML = '';
        };
    }, []);

    return (
        <div className="mb-8">
            <svg ref={networkRef} id="network" width="100%" height="300"></svg>
        </div>
    );
};

export default InteractiveNeuronChester;
