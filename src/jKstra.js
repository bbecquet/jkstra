import BFS from './algos/BFS.js';
import Dijkstra from './algos/Dijkstra.js';
import Graph from './core/Graph.js';
import { IN, OUT } from './core/constants.js';

const jKstra = {
    IN,
    OUT,
    Graph,
    algos: {
        BFS,
        Dijkstra
    }
};

export default jKstra;
