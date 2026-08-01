<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import NostrRelaysView from '$/views/NostrRelaysView.svelte'
</script>


<svelte:head>
	<title>Nostr relays • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._GlobalNostrNetwork, {
		scope: '_GlobalNostrNetwork',
	}).$$observedRelays}

	<NostrRelaysView
		href={resolve('/(social)/(nostr)/nostr/(globalNostrNetwork)/relays')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='observed-relays'
	/>
</Page>
