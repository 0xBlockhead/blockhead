<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import NostrRepostsView from '$/views/NostrRepostsView.svelte'
</script>


<svelte:head>
	<title>Nostr reposts • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._GlobalNostrNetwork, {
		scope: '_GlobalNostrNetwork',
	}).$$observedReposts}

	<NostrRepostsView
		href={resolve('/(social)/(nostr)/nostr/(globalNostrNetwork)/reposts')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='observed-reposts'
	/>
</Page>
