import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

export const quilibriumNodeMetricsBindings = [
	{
		provider: SourceProvider.QuilibriumNodeMetrics,
		source: Source.QuilibriumNodeMetrics_Prometheus,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'configured-quilibrium-node',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'env:QUILIBRIUM_NODE_PROMETHEUS_URL',
				origin: 'env:QUILIBRIUM_NODE_PROMETHEUS_URL',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Prometheus,
		apiFamily: ApiFamily.PrometheusText,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.ServerOnly,
		credentials: [
			{
				scope: SourceCredentialScope.LocalSecret,
			},
		],
	},
] as const satisfies readonly SourceBinding[]
