// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AgentPaymentRequirement_Timestamp,
	labels: {
		singular: 'agent payment requirement timestamp',
		plural: 'agent payment requirement observations',
	},
})({
	subjectKind: {
		label: 'subject kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	subjectSelector: {
		label: 'subject selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.One,
	},
	paymentProtocol: {
		label: 'payment protocol',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$a2aAgentService: {
		label: 'A2A agent service',
		entityType: EntityType.A2aAgentService,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$mcpServer: {
		label: 'MCP server',
		entityType: EntityType.McpServer,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$eip8004ServiceEndpoint: {
		label: 'EIP-8004 service endpoint',
		entityType: EntityType.Eip8004AgentServiceEndpoint,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$blockheadConnection: {
		label: 'blockhead connection',
		entityType: EntityType.BlockheadAgentConnection,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	required: {
		label: 'required',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	httpStatus: {
		label: 'HTTP status',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestMethod: {
		label: 'request method',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	resourceUrl: {
		label: 'resource URL',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	paymentRequiredHeader: {
		label: 'payment required header',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	paymentSignatureHeader: {
		label: 'payment signature header',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	paymentResponseHeader: {
		label: 'payment response header',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	paymentRequirements: {
		label: 'payment requirements',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	paymentPayload: {
		label: 'payment payload',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	paymentResponsePayload: {
		label: 'payment response payload',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	facilitatorUrl: {
		label: 'facilitator URL',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	scheme: {
		label: 'scheme',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	assetSelector: {
		label: 'asset selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	networkSelector: {
		label: 'network selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	price: {
		label: 'price',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	payTo: {
		label: 'pay to',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	maxAmountRequired: {
		label: 'max amount required',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	maxTimeoutSeconds: {
		label: 'max timeout seconds',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	evidenceUri: {
		label: 'evidence URI',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		label: 'error',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		SubjectKindSubjectSelectorPaymentProtocolTimestampMsSource: [
			'subjectKind',
			'subjectSelector',
			'paymentProtocol',
			'timestampMs',
			'source',
		],
	},
})
