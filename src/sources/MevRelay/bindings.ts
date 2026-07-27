// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

const mevRelayRestGenericReadOperationGroups = [
	SourceOperationGroup.GenericRead,
] as const
const mevRelayRestCredentials = [
	{
		scope: SourceCredentialScope.None,
	},
] as const
const mevRelayRestArtifacts = [
	{
		kind: SourceArtifactKind.HandwrittenTypes,
		path: 'src/sources/MevRelay/Rest/types.ts',
		generated: false,
	},
] as const

export default {
	[Source.MevRelay_Rest]: [
		{
			source: Source.MevRelay_Rest,
			target: {
				kind: SourceTargetKind.Feed,
				key: 'boost-relay.flashbots.net',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://boost-relay.flashbots.net',
					origin: 'https://boost-relay.flashbots.net',
					corsEnabled: false,
				},
			],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: mevRelayRestGenericReadOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: mevRelayRestCredentials,
			proxyId: '["MevRelay_Rest","Feed","boost-relay.flashbots.net","HttpProxy","RestJson"]',
			artifacts: mevRelayRestArtifacts,
		},
		{
			source: Source.MevRelay_Rest,
			target: {
				kind: SourceTargetKind.Feed,
				key: 'relay.ultrasound.money',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://relay.ultrasound.money',
					origin: 'https://relay.ultrasound.money',
					corsEnabled: false,
				},
			],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: mevRelayRestGenericReadOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: mevRelayRestCredentials,
			proxyId: '["MevRelay_Rest","Feed","relay.ultrasound.money","HttpProxy","RestJson"]',
			artifacts: mevRelayRestArtifacts,
		},
		{
			source: Source.MevRelay_Rest,
			target: {
				kind: SourceTargetKind.Feed,
				key: 'builder-relay-sepolia.flashbots.net',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://builder-relay-sepolia.flashbots.net',
					origin: 'https://builder-relay-sepolia.flashbots.net',
					corsEnabled: false,
				},
			],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: mevRelayRestGenericReadOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: mevRelayRestCredentials,
			proxyId: '["MevRelay_Rest","Feed","builder-relay-sepolia.flashbots.net","HttpProxy","RestJson"]',
			artifacts: mevRelayRestArtifacts,
		},
	],
} as const satisfies SourceBindingIndex
