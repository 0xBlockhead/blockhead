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
					fullname: String(params.fullname),
				}
			)
		}
		title='Replies'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='replies'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
