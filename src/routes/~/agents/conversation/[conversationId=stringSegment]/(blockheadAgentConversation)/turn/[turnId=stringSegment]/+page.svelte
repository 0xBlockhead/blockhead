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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadAgentConversationTurn, data.selector, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			userPrompt: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAgentConversationTurnView from '$/views/BlockheadAgentConversationTurnView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'agent conversation turn' : pageSelection.entity.userPrompt || 'agent conversation turn')} • agent conversation turn • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'agent conversation turn'} • agent conversation turn • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadAgentConversationTurnView
		selection={pageSelection}
	/>
	{/if}
</Page>
