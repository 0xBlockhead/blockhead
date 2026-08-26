<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


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
				Source.Atproto_Xrpc,
				Source.Atproto_BskySocial_Xrpc,
			],
		})}

	<AtprotoActorsView
		href={resolve('/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actors')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='observed-actors'
	/>
</Page>
