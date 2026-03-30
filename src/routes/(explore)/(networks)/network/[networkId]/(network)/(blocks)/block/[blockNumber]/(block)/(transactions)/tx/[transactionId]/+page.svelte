<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
</script>


<Page>
	<EvmTransactionView
		entityId={{
			$network: { chainId: Number(params.networkId) },
			txHash: params.transactionId as `0x${string}`,
		}}
		href={resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]/(block)/(transactions)/tx/[transactionId]',
			params,
		)}
	/>
</Page>
