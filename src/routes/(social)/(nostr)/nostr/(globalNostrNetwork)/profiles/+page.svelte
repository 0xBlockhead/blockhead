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
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='observed-profiles'
	/>
</Page>
