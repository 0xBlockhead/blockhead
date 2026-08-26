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
	import BlockheadAgentConversationsView from '$/views/BlockheadAgentConversationsView.svelte'
</script>


<svelte:head>
	<title>Agent conversations • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$blockheadAgentConversations',
	})
		.$$blockheadAgentConversations({
			sources: [
				Source.Local_Internal,
			],
		})}

	<BlockheadAgentConversationsView
		href={resolve('/~/agents/conversations')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='blockhead-agent-conversations'
	/>
</Page>
