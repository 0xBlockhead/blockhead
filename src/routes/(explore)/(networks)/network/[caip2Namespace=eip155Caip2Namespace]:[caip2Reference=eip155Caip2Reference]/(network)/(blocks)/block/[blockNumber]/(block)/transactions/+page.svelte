<script lang="ts">
	// State
	let { params } = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
</script>


<Page>
		<EvmBlockView
			selector={{
			$network: { caip2: { namespace: params.caip2Namespace, reference: params.caip2Reference } },
			blockNumber: BigInt(params.blockNumber),
		}}
	/>
</Page>
