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
		data,
		params,
	}: PageProps = $props()
	// Components
	import Page from '$/components/Page.svelte'
	import NostrReactionsView from '$/views/NostrReactionsView.svelte'
</script>


<svelte:head>
	<title>Note reactions • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.NostrNote, data.selector).$$reactions}

	<NostrReactionsView
		href={
			resolve(
				'/(social)/(nostr)/nostr/(globalNostrNetwork)/note/[eventId=stringSegment]/(nostrNote)/reactions',
				{
					eventId: params.eventId,
				}
			)
		}
		title='Note reactions'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='reactions'
	/>
</Page>
