const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const directory = __dirname;
const html = fs.readFileSync(path.join(directory, 'index.html'), 'utf8');
const inlineScript = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
  .map((match) => match[1])
  .find((script) => script.includes('const nodes=['));

if (!inlineScript) throw new Error('Architecture source script was not found.');

const capturePoint = '      if(!window.MSAGL){';
if (!inlineScript.includes(capturePoint)) throw new Error('Architecture source capture point changed.');

const source = inlineScript.replace(
  capturePoint,
  `      window.__blockheadArchitectureSource={nodes,edges,views,resolveView,expandBoundaryGateways,makeDot};
${capturePoint}`
);

const element = () => ({
  addEventListener() {},
  classList: { add() {}, remove() {} },
  innerHTML: '',
  querySelector() { return element(); },
  querySelectorAll() { return []; },
  textContent: '',
  value: ''
});
const root = element();
const document = {
  getElementById() { return root; }
};
const window = {};

vm.runInNewContext(source, {
  console,
  document,
  Map,
  Set,
  setTimeout() {},
  window
});

const architecture = window.__blockheadArchitectureSource;
if (!architecture) throw new Error('Architecture source was not captured.');

const semantic = architecture.resolveView('complete');
const routed = architecture.expandBoundaryGateways(semantic.nodes, semantic.edges);
const nodeIds = new Set(semantic.nodes.map((node) => node.data.id));
const edgeIds = new Set(semantic.edges.map((edge) => edge.data.id));

if (nodeIds.size !== semantic.nodes.length) throw new Error('Duplicate semantic node ID.');
if (edgeIds.size !== semantic.edges.length) throw new Error('Duplicate semantic edge ID.');
if (routed.gatewayIds.size % 2 !== 0) throw new Error('Boundary gateways must occur in egress/ingress pairs.');
if (routed.edgeBySegment.size !== routed.edges.length) throw new Error('A routed segment pair is ambiguous.');

for (const edge of semantic.edges) {
  const segments = routed.segmentsByEdge.get(edge.data.id) ?? [];
  if (segments.length !== 1 && segments.length !== 3) {
    throw new Error(`Relationship ${edge.data.id} has ${segments.length} routed segments.`);
  }
  const labels = routed.edges.filter((segment) =>
    routed.edgeBySegment.get(`${segment.data.source}\u0000${segment.data.target}`)?.data.id === edge.data.id
      && segment.data.label
  );
  if (labels.length !== 1) throw new Error(`Relationship ${edge.data.id} does not have exactly one visible label.`);
}

global.window = {};
require(path.join(directory, 'vendor', 'msagl-1.1.26.bundle.js'));
const dot = architecture.makeDot(routed.nodes, routed.edges);
const graph = global.window.MSAGL.parseDot(dot);
if (!graph) throw new Error('MSAGL did not parse the routed graph.');

console.log(
  `${semantic.nodes.length} components, ${semantic.edges.length} relationships, `
  + `${routed.gatewayIds.size} gateways, ${routed.edges.length} routed segments`
);
