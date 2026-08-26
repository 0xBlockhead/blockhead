<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()
	// Components
	import Page from '$/components/Page.svelte'
	import RedditCommentsView from '$/views/RedditCommentsView.svelte'
</script>


<svelte:head>
	<title>Comments • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.RedditLink, {
		fullname: decodeURIComponent(params.fullname),
	}).$$comments}

	<RedditCommentsView
		href={
			resolve(
				'/(social)/(reddit)/reddit/(globalRedditNetwork)/link/[fullname=stringSegment]/(redditLink)/comments',
				{
					fullname: params.fullname,
				}
			)
		}
		title='Comments'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='comments'
	/>
</Page>
