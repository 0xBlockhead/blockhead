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
	const pageEntityTitle = $derived((pageSelection.entity == null ? [String((pageSelection.entitySelector.userPrompt) ?? '')].filter(Boolean).join(' ') || 'agent conversation turn' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).userPrompt) ?? '')].filter(Boolean).join(' ') || 'agent conversation turn'))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAgentConversationTurnView from '$/views/BlockheadAgentConversationTurnView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • agent conversation turn • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadAgentConversationTurnView
		href={
			resolve('/~/agents/conversation/[conversationId=stringSegment]/turn/[turnId=stringSegment]', {
				conversationId: params.conversationId,
				turnId: params.turnId,
			})
		}
		selection={pageSelection}
	/>
</Page>
