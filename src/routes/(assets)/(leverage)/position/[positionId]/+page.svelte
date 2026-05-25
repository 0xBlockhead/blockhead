<script lang="ts">
	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import LeverageView from '$/views/LeverageView.svelte'
</script>


<Page>
	<LeverageView
		entityId={{
			$network: { chainId: 1 },
			id: params.positionId,
		}}
	/>
</Page>
