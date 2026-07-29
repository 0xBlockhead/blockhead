// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
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
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Covalent/GoldRush/Rest/types.ts',
				generated: false,
				referenceUrl: 'https://goldrush.dev/docs/skills/goldrush-foundational-api/references/endpoints-transactions/',
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.GoldRushFoundational_Rest]: typeof bindings[0] }>(bindings)
