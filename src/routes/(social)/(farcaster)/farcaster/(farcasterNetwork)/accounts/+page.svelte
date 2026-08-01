<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadFarcasterAccountConnectionsView from '$/views/BlockheadFarcasterAccountConnectionsView.svelte'
</script>


<svelte:head>
	<title>Farcaster accounts • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$blockheadFarcasterAccountConnections',
	}).$$blockheadFarcasterAccountConnections}

	<BlockheadFarcasterAccountConnectionsView
		href={resolve('/(social)/(farcaster)/farcaster/(farcasterNetwork)/accounts')}
		title='Farcaster accounts'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='blockhead-farcaster-account-connections'
	/>
</Page>
