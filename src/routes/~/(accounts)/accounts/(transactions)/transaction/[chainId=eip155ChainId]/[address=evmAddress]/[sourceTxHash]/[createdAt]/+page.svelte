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
	import BridgeTransactionView from '$/views/BridgeTransactionView.svelte'
</script>


<Page>
	<BridgeTransactionView
		selection={select(EntityType.BridgeTransaction, {
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
