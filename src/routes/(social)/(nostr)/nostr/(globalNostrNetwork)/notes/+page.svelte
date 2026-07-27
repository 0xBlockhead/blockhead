<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import NostrNotesView from '$/views/NostrNotesView.svelte'
</script>


<svelte:head>
	<title>Nostr notes • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._GlobalNostrNetwork, {
		scope: '_GlobalNostrNetwork',
	}).$$observedNotes}

	<NostrNotesView
		href={resolve('/(social)/(nostr)/nostr/(globalNostrNetwork)/notes')}
		title='Nostr notes'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='observed-notes'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
