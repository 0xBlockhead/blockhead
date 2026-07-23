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
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadAgentConversation, data.selector, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			name: true,
			updatedAt: true,
			pinned: true,
			createdAt: true,
			defaultConnectionId: true,
			defaultModelId: true,
			$profile: true,
			systemPrompt: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAgentConversationView from '$/views/BlockheadAgentConversationView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.id) ?? '')].filter(Boolean).join(' ') || 'agent conversation' : [String((({ ...data.selector, ...pageSelection.entity }).name) ?? '')].filter(Boolean).join(' ') || [String((({ ...data.selector, ...pageSelection.entity }).id) ?? '')].filter(Boolean).join(' ') || 'agent conversation'))} • agent conversation • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadAgentConversationView
		href={
			resolve('/~/agents/conversation/[conversationId=stringSegment]', {
				conversationId: params.conversationId,
			})
		}
		selection={pageSelection}
	/>
</Page>
