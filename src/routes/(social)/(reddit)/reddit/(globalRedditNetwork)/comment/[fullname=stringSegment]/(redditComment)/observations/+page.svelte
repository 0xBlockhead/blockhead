<!-- Generated from APP.ts. -->

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
	import RedditComment_TimestampsView from '$/views/RedditComment_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Comment observations • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.RedditComment, {
		fullname: decodeURIComponent(params.fullname),
	}).$$timestamps}

	<RedditComment_TimestampsView
		href={
			resolve(
				'/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]/(redditComment)/observations',
				{
					fullname: params.fullname,
				}
			)
		}
		title='Comment observations'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='timestamps'
	/>
</Page>
