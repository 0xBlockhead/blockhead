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
		data,
		params,
	}: PageProps = $props()
	// Components
	import Page from '$/components/Page.svelte'
	import NostrNotesView from '$/views/NostrNotesView.svelte'
</script>


<svelte:head>
	<title>Note replies • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.NostrNote, data.selector).$$replies}

	<NostrNotesView
		href={
			resolve(
				'/(social)/(nostr)/nostr/(globalNostrNetwork)/note/[eventId=stringSegment]/(nostrNote)/replies',
				{
					eventId: params.eventId,
				}
			)
		}
		title='Note replies'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='replies'
	/>
</Page>
