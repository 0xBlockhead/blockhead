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
	import RedditSubreddit_TimestampsView from '$/views/RedditSubreddit_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Subreddit observations • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.RedditSubreddit, {
		name: decodeURIComponent(params.name),
	}).$$timestamps}

	<RedditSubreddit_TimestampsView
		href={
			resolve(
				'/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]/(redditSubreddit)/observations',
				{
					name: String(params.name),
				}
			)
		}
		title='Subreddit observations'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='timestamps'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
