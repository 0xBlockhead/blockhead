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
	import RedditLink_TimestampsView from '$/views/RedditLink_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Submission observations • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.RedditLink, {
		fullname: decodeURIComponent(params.fullname),
	}).$$timestamps}

	<RedditLink_TimestampsView
		href={
			resolve(
				'/(social)/(reddit)/reddit/(globalRedditNetwork)/link/[fullname=stringSegment]/(redditLink)/observations',
				{
					fullname: params.fullname,
				}
			)
		}
		title='Submission observations'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='timestamps'
	/>
</Page>
