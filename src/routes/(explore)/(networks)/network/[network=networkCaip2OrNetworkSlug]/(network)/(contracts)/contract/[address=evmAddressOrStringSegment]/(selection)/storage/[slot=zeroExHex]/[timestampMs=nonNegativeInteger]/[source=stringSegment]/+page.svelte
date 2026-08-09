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

	const pageSelection = $derived(select(EntityType.EvmStorageRead_Timestamp, {
		$contract: data.selector,
		slot: params.slot,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmStorageRead_TimestampView from '$/views/EvmStorageRead_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.slot || 'EVM storage read timestamp')} • EVM storage read timestamp • Blockhead</title>
</svelte:head>


<Page>
	<EvmStorageRead_TimestampView
		selection={pageSelection}
	/>
</Page>
