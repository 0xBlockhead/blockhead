<script lang="ts">
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
</script>


<Page>
	<LiquidityPoolView
		selector={{
			$network: { caip2: { namespace: 'eip155' as const, reference: String(Number(params.chainId)) } },
			id: params.poolId,
		}}
	/>
</Page>
