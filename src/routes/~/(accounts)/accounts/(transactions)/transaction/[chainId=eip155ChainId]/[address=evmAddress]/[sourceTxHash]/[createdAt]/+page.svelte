<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadBridgeTransactionView from '$/views/BlockheadBridgeTransactionView.svelte'
</script>


<Page>
	<BlockheadBridgeTransactionView
		selection={select(EntityType.BlockheadBridgeTransaction, {
			$account: {
				address: EvmAddress.assert(params.address),
			},
			$sourceTx: {
				$network: { caip2: { namespace: 'eip155' as const, reference: String((Number(params.chainId))) } },
				txHash: ZeroExHex.assert(params.sourceTxHash),
			},
			createdAt: Number(params.createdAt),
		})}
	/>
</Page>
