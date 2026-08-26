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
	<title>Replies • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.RedditComment, {
		fullname: decodeURIComponent(params.fullname),
	}).$$replies}

	<RedditCommentsView
		href={
			resolve(
				'/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]/(redditComment)/replies',
				{
					fullname: params.fullname,
				}
			)
		}
		title='Replies'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='replies'
	/>
</Page>
