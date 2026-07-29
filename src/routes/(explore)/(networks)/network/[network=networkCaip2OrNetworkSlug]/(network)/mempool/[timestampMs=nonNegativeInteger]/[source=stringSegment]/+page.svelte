<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pageSelection = $derived(select(EntityType.EvmNetwork_Txpool_Timestamp, data.selector, {
		sources: [data.selector.source],
		fields: {
			pendingCount: true,
			queuedCount: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetwork_Txpool_TimestampView from '$/views/EvmNetwork_Txpool_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'EVM network txpool timestamp' : [String(pageSelection.entity.pendingCount) + ' pending', String(pageSelection.entity.queuedCount) + ' queued'].filter(Boolean).join(' ') || 'EVM network txpool timestamp')} • EVM network txpool timestamp • Blockhead</title>
</svelte:head>


<Page>
	<EvmNetwork_Txpool_TimestampView
		selection={pageSelection}
	/>
</Page>
