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
	import AtprotoPost_TimestampsView from '$/views/AtprotoPost_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Post observations • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.AtprotoPost, {
		uri: decodeURIComponent(params.uri),
	}).$$timestamps}

	<AtprotoPost_TimestampsView
		href={
			resolve(
				'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/post/[...uri=stringSegment]/(atprotoPost)/observations',
				{
					uri: params.uri,
				}
			)
		}
		title='Post observations'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='timestamps'
	/>
</Page>
