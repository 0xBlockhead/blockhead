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

	const pageSelection = $derived(select(EntityType.BlockheadAgentConnection, data.selector, {
		sources: [
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAgentConnectionView from '$/views/BlockheadAgentConnectionView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.connectionId || 'blockhead agent connection')} • blockhead agent connection • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadAgentConnectionView
		selection={pageSelection}
	/>
</Page>
