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
	import BlockheadAgentConversationView from '$/views/BlockheadAgentConversationView.svelte'
</script>


<Page>
	<BlockheadAgentConversationView
		href={
			resolve('/~/agents/conversation/[conversationId]', {
				conversationId: params.conversationId,
			})
		}
		selection={
			select(EntityType.BlockheadAgentConversation, {
				id: params.conversationId,
			}, {
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
			})
		}
	/>
</Page>
