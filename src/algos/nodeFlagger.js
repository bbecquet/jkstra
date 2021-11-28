
export default class {
    constructor(graph, flagKey) {
        this.graph = graph;
        this.flagKey = flagKey;
    }

    clearFlags(graph) {
        this.graph.forEachVertex(v => {
            delete v[this.flagKey];
        });
    }

    getFlags(v) {
        return v[this.flagKey] || {};
    }

    setFlags(v, flags) {
        if (!v.hasOwnProperty(this.flagKey)) {
            v[this.flagKey] = {};
        }
        for (let key in flags) {
            v[this.flagKey][key] = flags[key];
        }
    }
}
