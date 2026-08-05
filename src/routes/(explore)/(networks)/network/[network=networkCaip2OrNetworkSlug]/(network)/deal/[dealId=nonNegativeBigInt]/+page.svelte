<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.FilecoinDeal, data.selector, {
		sources: [
			Source.Filfox_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinDealView from '$/views/FilecoinDealView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.dealId) || 'filecoin deal')} • filecoin deal • Blockhead</title>
</svelte:head>


<Page>
	<FilecoinDealView
		selection={pageSelection}
	/>
</Page>
