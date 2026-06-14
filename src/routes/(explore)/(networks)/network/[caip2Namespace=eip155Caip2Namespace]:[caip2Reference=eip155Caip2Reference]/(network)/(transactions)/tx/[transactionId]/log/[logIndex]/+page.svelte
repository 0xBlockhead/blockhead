<script lang="ts">
	// State
	let { params } = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmLogView from '$/views/EvmLogView.svelte'
</script>


<Page>
	<EvmLogView
		selector={{
			$network: { caip2: { namespace: params.caip2Namespace, reference: params.caip2Reference } },
			txHash: params.transactionId as `0x${string}`,
			logIndex: Number(params.logIndex),
		}}
	/>
</Page>
