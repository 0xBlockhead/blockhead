<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()
	// Components
	import Page from '$/components/Page.svelte'
	import RedditLinksView from '$/views/RedditLinksView.svelte'
</script>


<svelte:head>
	<title>Subreddit submissions • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.RedditSubreddit, {
		name: decodeURIComponent(params.name),
	}).$$links}

	<RedditLinksView
		href={
			resolve(
				'/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]/(redditSubreddit)/links',
				{
					name: params.name,
				}
			)
		}
		title='Subreddit submissions'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='links'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
