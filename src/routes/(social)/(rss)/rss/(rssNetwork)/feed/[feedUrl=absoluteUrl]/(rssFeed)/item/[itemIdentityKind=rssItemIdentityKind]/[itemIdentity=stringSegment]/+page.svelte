<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import RssItemView from '$/views/RssItemView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.RssItem, data.selector, {
					sources: [
						Source.Rss_Rest,
						Source.Rss2Json_Rest,
					],
					fields: {
						title: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.itemIdentity ?? '') || 'RSS item' : [(pageSelection.entity.title ?? ''), pageSelection.entitySelector.itemIdentity].filter(Boolean).join(' ') || 'RSS item')} • RSS item • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'RSS item'} • RSS item • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.RssItem, data.selector, {
					sources: [
						Source.Rss_Rest,
						Source.Rss2Json_Rest,
					],
					fields: {
						title: true,
					},
				}))}

		<RssItemView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
