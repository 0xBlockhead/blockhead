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

	const pageSelection = $derived(select(EntityType.A2aAgentCard, data.selector, {
		sources: [
			Source.Eip8004Scan_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import A2aAgentCardView from '$/views/A2aAgentCardView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.agentCardUrl || 'A2A agent card')} • A2A agent card • Blockhead</title>
</svelte:head>


<Page>
	<A2aAgentCardView
		selection={pageSelection}
	/>
</Page>
