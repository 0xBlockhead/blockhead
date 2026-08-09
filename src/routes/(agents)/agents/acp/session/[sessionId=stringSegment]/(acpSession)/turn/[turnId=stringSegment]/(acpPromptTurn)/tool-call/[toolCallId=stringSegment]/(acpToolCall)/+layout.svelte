<!-- Generated from APP.ts. -->

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

	const detailHref = $derived(
		resolve(
			'/(agents)/agents/acp/session/[sessionId=stringSegment]/(acpSession)/turn/[turnId=stringSegment]/(acpPromptTurn)/tool-call/[toolCallId=stringSegment]',
			{
				sessionId: params.sessionId,
				turnId: params.turnId,
				toolCallId: params.toolCallId,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import AcpToolCallView from '$/views/AcpToolCallView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		<AcpToolCallView
			selection={
				select(EntityType.AcpToolCall, data.selector, {
					sources: [
						Source.AcpLocal_JsonRpc,
					],
				})
			}
			href={detailHref}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
