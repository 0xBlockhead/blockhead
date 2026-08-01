<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadAgentConversationTurn, {
		$conversation: {
			id: params.conversationId,
		},
		id: params.turnId,
	}, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			userPrompt: true,
			createdAt: true,
			status: true,
			providerId: true,
			promptVersion: true,
			parentId: true,
			error: true,
			assistantText: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAgentConversationTurnView from '$/views/BlockheadAgentConversationTurnView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? 'agent conversation turn' : pageSelection.entity.userPrompt || 'agent conversation turn'} • agent conversation turn • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadAgentConversationTurnView
		selection={pageSelection}
	/>
</Page>
