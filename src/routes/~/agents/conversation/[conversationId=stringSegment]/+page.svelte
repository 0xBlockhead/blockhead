<!-- Generated from APP.ts. Do not edit by hand. -->

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
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.id ?? '') || 'agent conversation' : (pageSelection.entity.name ?? '') || pageSelection.entitySelector.id || 'agent conversation')} • agent conversation • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadAgentConversationView
		selection={pageSelection}
	/>
</Page>
