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
		entityId={{
			$network: { chainId: Number(params.chainId) },
			id: params.positionId,
		}}
	/>
</Page>
