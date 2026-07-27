// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.GoldRushFoundational_Rest]: {
		source: Source.GoldRushFoundational_Rest,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '1',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.covalenthq.com',
				origin: 'https://api.covalenthq.com',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.GoldRushFoundationalApi,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.RuntimeSecret,
			},
		],
		proxyId: '["GoldRushFoundational_Rest","Eip155Chain","1","HttpProxy","GoldRushFoundationalApi"]',
		serverCredentialId: '["GoldRushFoundational_Rest","Eip155Chain","1","HttpProxy","GoldRushFoundationalApi"]',
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Covalent/GoldRush/Rest/types.ts',
				generated: false,
				referenceUrl: 'https://goldrush.dev/docs/skills/goldrush-foundational-api/references/endpoints-transactions/',
			},
		],
	},
} as const satisfies SourceBindingIndex
