import {
	describe,
	expect,
	it,
} from 'vitest'

import { TransportType } from '$/constants/TransportType.ts'
import bindings from '$/sources/Hyperliquid/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
const {
	hyperliquidJsonRpcBinding,
	hyperliquidJsonRpcEndpoints,
} = await import('$/sources/Hyperliquid/JsonRpc/transport.ts')

const binding = bindings[Source.Hyperliquid].find(
	({ apiFamily }) => apiFamily === ApiFamily.EvmExecutionJsonRpc
)

if (binding == null)
	throw new Error('Hyperliquid EVM binding is missing')

describe('Hyperliquid JSON-RPC transport', () => {
	it('uses the exact canonical HyperEVM binding axes', () => {
		expect(hyperliquidJsonRpcBinding).toBe(binding)
		expect(binding).toMatchObject({
			endpoints: [{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc.hyperliquid.xyz/evm',
				corsEnabled: true,
			}],
			wireProtocol: WireProtocol.JsonRpc2,
			apiFamily: ApiFamily.EvmExecutionJsonRpc,
			operationGroups: [SourceOperationGroup.EvmRpcCore],
			delivery: SourceDelivery.BrowserDirect,
			credentials: [],
			artifacts: [{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
			}, {
				kind: SourceArtifactKind.OpenRpcSpec,
				path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
			}],
		})
	})

	it('derives the resolver transport endpoints from that binding', () => {
		expect(hyperliquidJsonRpcEndpoints).toEqual([{
			url: 'https://rpc.hyperliquid.xyz/evm',
			transportType: TransportType.Http,
			providerName: 'Hyperliquid',
		}])
	})
})
