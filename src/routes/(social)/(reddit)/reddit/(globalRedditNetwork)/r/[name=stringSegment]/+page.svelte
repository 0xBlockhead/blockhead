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
	import RedditSubredditView from '$/views/RedditSubredditView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.RedditSubreddit, data.selector, {
				sources: [
					Source.Reddit_PublicJson,
					Source.Reddit_Rest,
				],
				fields: {
					title: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'r/' + (pageSelection.entitySelector.name ?? '') : (pageSelection.entity.title ?? '') || 'r/' + pageSelection.entitySelector.name)} • Reddit subreddit • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Reddit subreddit'} • Reddit subreddit • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.RedditSubreddit, data.selector, {
				sources: [
					Source.Reddit_PublicJson,
					Source.Reddit_Rest,
				],
				fields: {
					title: true,
				},
			})}

	<RedditSubredditView
		selection={pageSelection}
	/>
	{/if}
</Page>
