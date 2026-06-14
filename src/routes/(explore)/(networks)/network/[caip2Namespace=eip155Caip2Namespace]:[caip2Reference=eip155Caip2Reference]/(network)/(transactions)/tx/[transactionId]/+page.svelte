<script lang="ts">
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
			selector={{
			$network: { caip2: { namespace: params.caip2Namespace, reference: params.caip2Reference } },
			txHash: params.transactionId as `0x${string}`,
		}}
	/>
</Page>
