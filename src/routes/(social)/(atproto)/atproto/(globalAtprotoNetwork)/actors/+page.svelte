<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoActorsView from '$/views/AtprotoActorsView.svelte'
</script>


<svelte:head>
	<title>AT Protocol accounts • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._GlobalAtprotoNetwork, {
		scope: '_GlobalAtprotoNetwork',
	})
		.$$observedActors({
			sources: [
				Source.Constants_Internal,
			],
		})}

	<AtprotoActorsView
		href={resolve('/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actors')}
		title='AT Protocol accounts'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='observed-actors'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
