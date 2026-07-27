<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import NostrArticlesView from '$/views/NostrArticlesView.svelte'
</script>


<svelte:head>
	<title>Nostr articles • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._GlobalNostrNetwork, {
		scope: '_GlobalNostrNetwork',
	}).$$observedArticles}

	<NostrArticlesView
		href={resolve('/(social)/(nostr)/nostr/(globalNostrNetwork)/articles')}
		title='Nostr articles'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='observed-articles'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
