<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


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
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='observed-notes'
	/>
</Page>
