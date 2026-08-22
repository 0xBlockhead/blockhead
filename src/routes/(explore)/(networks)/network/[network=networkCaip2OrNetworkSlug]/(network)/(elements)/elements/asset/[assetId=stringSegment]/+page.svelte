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

	const pageSelection = $derived(select(EntityType.ElementsAsset, data.selector, {
		sources: [
			Source.Esplora_Rest,
		],
		fields: {
			name: true,
			ticker: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ElementsAssetView from '$/views/ElementsAssetView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.assetId ?? '') || 'Elements asset' : [(pageSelection.entity.name ?? ''), (pageSelection.entity.ticker ?? ''), pageSelection.entitySelector.assetId].filter(Boolean).join(' ') || 'Elements asset')} • Elements asset • Blockhead</title>
</svelte:head>


<Page>
	<ElementsAssetView
		selection={pageSelection}
	/>
</Page>
