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
	import BlockheadAgentConversationView from '$/views/BlockheadAgentConversationView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadAgentConversation, data.selector, {
				sources: [
					Source.Local_Internal,
				],
				fields: {
					name: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.id ?? '') || 'agent conversation' : (pageSelection.entity.name ?? '') || pageSelection.entitySelector.id || 'agent conversation')} • agent conversation • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'agent conversation'} • agent conversation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadAgentConversation, data.selector, {
				sources: [
					Source.Local_Internal,
				],
				fields: {
					name: true,
				},
			})}

	<BlockheadAgentConversationView
		selection={pageSelection}
	/>
	{/if}
</Page>
