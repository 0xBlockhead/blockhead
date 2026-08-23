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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.RssItem, data.selector, {
		sources: [
			Source.Rss_Rest,
			Source.Rss2Json_Rest,
		],
		fields: {
			title: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import RssItemView from '$/views/RssItemView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.itemIdentity ?? '') || 'RSS item' : [(pageSelection.entity.title ?? ''), pageSelection.entitySelector.itemIdentity].filter(Boolean).join(' ') || 'RSS item')} • RSS item • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'RSS item'} • RSS item • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<RssItemView
		selection={pageSelection}
	/>
	{/if}
</Page>
