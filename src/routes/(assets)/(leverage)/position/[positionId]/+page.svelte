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
			$network: { caip2: { namespace: 'eip155' as const, reference: String(1) } },
			id: params.positionId,
		}}
	/>
</Page>
