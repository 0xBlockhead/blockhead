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
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAgentConversationTurnView from '$/views/BlockheadAgentConversationTurnView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadAgentConversationTurn, data.selector, {
				sources: [
					Source.Local_Internal,
				],
				fields: {
					userPrompt: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'agent conversation turn' : pageSelection.entity.userPrompt || 'agent conversation turn')} • agent conversation turn • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'agent conversation turn'} • agent conversation turn • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadAgentConversationTurn, data.selector, {
				sources: [
					Source.Local_Internal,
				],
				fields: {
					userPrompt: true,
				},
			})}

	<BlockheadAgentConversationTurnView
		selection={pageSelection}
	/>
	{/if}
</Page>
