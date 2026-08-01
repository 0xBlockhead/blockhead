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
	import NostrNotesView from '$/views/NostrNotesView.svelte'
</script>


<svelte:head>
	<title>Profile notes • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.NostrProfile, data.selector).$$notes}

	<NostrNotesView
		href={
			resolve(
				'/(social)/(nostr)/nostr/(globalNostrNetwork)/profile/[pubkey=stringSegment]/(nostrProfile)/notes',
				{
					pubkey: params.pubkey,
				}
			)
		}
		title='Profile notes'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='notes'
	/>
</Page>
