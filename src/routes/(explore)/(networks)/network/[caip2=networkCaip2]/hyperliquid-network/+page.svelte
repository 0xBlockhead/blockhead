<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import HyperliquidNetworkView from '$/views/HyperliquidNetworkView.svelte'
</script>


<Page>
	<HyperliquidNetworkView
		selection={select(EntityType.HyperliquidNetwork, data.selector)}
	/>
</Page>
