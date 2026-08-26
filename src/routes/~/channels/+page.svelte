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
	import BlockheadStateChannelsView from '$/views/BlockheadStateChannelsView.svelte'
</script>


<svelte:head>
	<title>Channels • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$blockheadStateChannels',
	}).$$blockheadStateChannels}

	<BlockheadStateChannelsView
		href={resolve('/~/channels')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='blockhead-state-channels'
	/>
</Page>
