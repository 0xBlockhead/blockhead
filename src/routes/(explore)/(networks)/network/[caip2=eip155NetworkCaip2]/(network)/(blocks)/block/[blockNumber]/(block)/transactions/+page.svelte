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
			$network: { caip2: { namespace: 'eip155', reference: params.caip2.slice('eip155:'.length) } },
			blockNumber: BigInt(params.blockNumber),
		}}
	/>
</Page>
