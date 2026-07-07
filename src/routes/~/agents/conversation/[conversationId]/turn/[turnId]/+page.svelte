<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAgentConversationTurnView from '$/views/BlockheadAgentConversationTurnView.svelte'
</script>


<svelte:head>
	<title>Agent conversation turn • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadAgentConversationTurnView
		href={
			resolve('/~/agents/conversation/[conversationId]/turn/[turnId]', {
				conversationId: params.conversationId,
				turnId: params.turnId,
			})
		}
		selection={
			select(EntityType.BlockheadAgentConversationTurn, {
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
			})
		}
	/>
</Page>
