<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAgentConversationsView from '$/views/BlockheadAgentConversationsView.svelte'
</script>


<svelte:head>
	<title>Agent conversations • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadAgentConversationsView
		href={resolve('/~/agents/conversations')}
		title='Agent conversations'
		selection={
			select(EntityType._Global, {
				scope: '$$blockheadAgentConversations',
			})[EntityProxyField]<EntityType.BlockheadAgentConversation>('$$blockheadAgentConversations', {
				sources: [
					Source.Local_Internal,
				],
			})
		}
		id='BlockheadAgentConversationsView-page'
	/>
</Page>
