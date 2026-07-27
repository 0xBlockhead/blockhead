<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import BlockheadAgentConversationView from '$/views/BlockheadAgentConversationView.svelte'
</script>


{#key params.conversationId}
	<ParentPageCollapsible
		href={
			resolve(
				'/~/agents/conversation/[conversationId=stringSegment]',
				{
					conversationId: String(params.conversationId),
				}
			)
		}
	>
		{#snippet Summary()}
			<BlockheadAgentConversationView
				selection={
					select(EntityType.BlockheadAgentConversation, data.selector, { sources: [
						Source.Local_Internal,
					] })
				}
				href={
					resolve(
						'/~/agents/conversation/[conversationId=stringSegment]',
						{
							conversationId: String(params.conversationId),
						}
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
