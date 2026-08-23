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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.RssFeed, data.selector, {
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
	import RssFeedView from '$/views/RssFeedView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.feedUrl ?? '') || 'RSS feed' : [(pageSelection.entity.title ?? ''), pageSelection.entitySelector.feedUrl].filter(Boolean).join(' ') || 'RSS feed')} • RSS feed • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'RSS feed'} • RSS feed • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<RssFeedView
		selection={pageSelection}
	/>
	{/if}
</Page>
