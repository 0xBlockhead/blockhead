<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import NostrReactionsView from '$/views/NostrReactionsView.svelte'
</script>


<svelte:head>
	<title>Nostr reactions • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._GlobalNostrNetwork, {
		scope: '_GlobalNostrNetwork',
	}).$$observedReactions}

	<NostrReactionsView
		href={resolve('/(social)/(nostr)/nostr/(globalNostrNetwork)/reactions')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='observed-reactions'
	/>
</Page>
