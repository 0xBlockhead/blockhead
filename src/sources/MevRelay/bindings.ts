import { mevRelayHosts } from '$/constants/MevRelayHosts.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

export const mevRelayBindings = mevRelayHosts.map((relay) => ({
	provider: SourceProvider.MevRelay,
	source: Source.MevRelay_Rest,
	target: {
		kind: SourceTargetKind.Feed,
		key: relay.host,
	},
	endpoints: [
		{
			endpointKind: SourceEndpointKind.HttpUrl,
			locator: `https://${relay.host}`,
			origin: `https://${relay.host}`,
			corsEnabled: false,
		},
	],
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.RestJson,
	operationGroups: [
		SourceOperationGroup.GenericRead,
	],
	delivery: SourceDelivery.HttpProxy,
	credentials: [
		{
			scope: SourceCredentialScope.None,
		},
	],
	artifacts: [
		{
			kind: SourceArtifactKind.HandwrittenTypes,
			path: 'src/sources/MevRelay/Rest/types.ts',
			generated: false,
		},
	],
})) satisfies readonly SourceBinding[]
