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


	// Components
	import Page from '$/components/Page.svelte'
	import RedditLinkView from '$/views/RedditLinkView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.RedditLink, data.selector, {
				sources: [
					Source.Reddit_PublicJson,
					Source.Reddit_Rest,
				],
				fields: {
					title: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.fullname ?? '') || 'Reddit submission' : (pageSelection.entity.title ?? '') || pageSelection.entitySelector.fullname || 'Reddit submission')} • Reddit submission • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Reddit submission'} • Reddit submission • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.RedditLink, data.selector, {
				sources: [
					Source.Reddit_PublicJson,
					Source.Reddit_Rest,
				],
				fields: {
					title: true,
				},
			})}

	<RedditLinkView
		selection={pageSelection}
	/>
	{/if}
</Page>
