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
	import AtprotoActor_TimestampsView from '$/views/AtprotoActor_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Account observations • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.AtprotoActor, {
		did: decodeURIComponent(params.did),
	}).$$timestamps}

	<AtprotoActor_TimestampsView
		href={
			resolve(
				'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]/(atprotoActor)/observations',
				{
					did: String(params.did),
				}
			)
		}
		title='Account observations'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='timestamps'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
