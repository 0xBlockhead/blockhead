<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pageSelection = $derived(select(EntityType.Market, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'Market'} • Market • Blockhead</title>
</svelte:head>


<Page>
	<MarketView
		selection={pageSelection}
	/>
</Page>
