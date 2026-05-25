<script lang="ts">
	// Props
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
</script>


<Page>
	<LiquidityPoolView
		entityId={{
			$network: { chainId: Number(params.chainId) },
			id: params.poolId,
		}}
	/>
</Page>
