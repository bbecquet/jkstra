import BFS from './algos/BFS.js';
import DijkstraIterator from './algos/DijkstraIterator.js';
import Dijkstra from './algos/Dijkstra.js';
import BidirectionalDijkstra from './algos/BidirectionalDijkstra.js';
import Graph from './core/Graph.js';
import { IN, OUT } from './core/constants.js';

const jKstra = {
    IN,
    OUT,
    Graph,
    algos: {
        BFS,
        Dijkstra,
        BidirectionalDijkstra,
        DijkstraIterator
    }
};

export default jKstra;
