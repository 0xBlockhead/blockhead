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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadAgentConnection_Timestamp, {
		$connection: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAgentConnection_TimestampView from '$/views/BlockheadAgentConnection_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead agent connection timestamp')} • blockhead agent connection timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadAgentConnection_TimestampView
		selection={pageSelection}
	/>
</Page>
