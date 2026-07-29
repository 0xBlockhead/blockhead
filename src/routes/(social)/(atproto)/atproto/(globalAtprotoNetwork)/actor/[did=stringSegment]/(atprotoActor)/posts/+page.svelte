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
	import AtprotoPostsView from '$/views/AtprotoPostsView.svelte'
</script>


<svelte:head>
	<title>Account posts • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.AtprotoActor, {
		did: decodeURIComponent(params.did),
	}).$$posts}

	<AtprotoPostsView
		href={
			resolve(
				'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]/(atprotoActor)/posts',
				{
					did: params.did,
				}
			)
		}
		title='Account posts'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='posts'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
