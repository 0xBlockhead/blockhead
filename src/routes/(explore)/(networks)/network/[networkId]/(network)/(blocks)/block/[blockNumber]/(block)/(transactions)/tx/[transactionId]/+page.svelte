<script lang="ts">
	// Props
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
	/>
</Page>

