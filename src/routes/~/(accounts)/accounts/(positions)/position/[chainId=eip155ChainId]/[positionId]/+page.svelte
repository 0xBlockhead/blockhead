<script lang="ts">
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPositionView from '$/views/LiquidityPositionView.svelte'
</script>


<Page>
	<LiquidityPositionView
		selector={{
			$network: { caip2: { namespace: 'eip155' as const, reference: String(Number(params.chainId)) } },
			id: params.positionId,
		}}
	/>
</Page>
