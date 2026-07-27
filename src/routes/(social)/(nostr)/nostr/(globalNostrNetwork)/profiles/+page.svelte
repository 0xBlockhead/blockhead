<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import NostrProfilesView from '$/views/NostrProfilesView.svelte'
</script>


<svelte:head>
	<title>Nostr profiles • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._GlobalNostrNetwork, {
		scope: '_GlobalNostrNetwork',
	}).$$observedProfiles}

	<NostrProfilesView
		href={resolve('/(social)/(nostr)/nostr/(globalNostrNetwork)/profiles')}
		title='Nostr profiles'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='observed-profiles'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
