<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.A2aAgentService, data.selector, {
		sources: [],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import A2aAgentServiceView from '$/views/A2aAgentServiceView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.endpointUrl || 'A2A agent service')} • A2A agent service • Blockhead</title>
</svelte:head>


<Page>
	<A2aAgentServiceView
		selection={pageSelection}
	/>
</Page>
