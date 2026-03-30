<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import EvmBlocksView from '$/views/EvmBlocksView.svelte'
</script>


<Page>
	<EvmBlocksView
		href={resolve('/(explore)/(networks)/network/[networkId]/(network)/blocks', params)}
		id="blocks"
	/>
</Page>
