<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

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
		href={resolve('/(assets)/(leverage)/position/[positionId]', params)}
	/>
</Page>
