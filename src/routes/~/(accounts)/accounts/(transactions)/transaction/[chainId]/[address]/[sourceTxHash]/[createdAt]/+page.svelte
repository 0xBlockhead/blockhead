<script lang="ts">
	// Types/constants
	import { networkIdFromEvmChainId } from '$/lib/caip.ts'


	// State
	let {
		params,
	} = $props()

	const chainId = $derived(Number(params.chainId))


	// Components
	import Page from '$/components/Page.svelte'
	import BridgeTransactionView from '$/views/BridgeTransactionView.svelte'
</script>


<Page>
	<BridgeTransactionView
		entityId={{
			$account: {
				$network: networkIdFromEvmChainId(chainId),
				address: params.address as `0x${string}`,
			},
			$sourceTx: {
				$network: networkIdFromEvmChainId(chainId),
				txHash: params.sourceTxHash as `0x${string}`,
			},
			createdAt: Number(params.createdAt),
		}}
	/>
</Page>
