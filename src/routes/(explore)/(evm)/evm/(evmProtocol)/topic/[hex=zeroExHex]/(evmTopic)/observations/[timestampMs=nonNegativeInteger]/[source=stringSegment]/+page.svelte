<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EvmTopic_Timestamp, {
		$topic: {
			hex: decodeURIComponent(params.hex),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
		$topic: {
			hex: decodeURIComponent(params.hex),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}).source],
		fields: {
			signatures: true,
			filteredSignatureCount: true,
			verifiedCandidateCount: true,
			reachable: true,
		},
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? 'EVM topic observation' : 'EVM topic observation'))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmTopic_TimestampView from '$/views/EvmTopic_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • EVM topic observation • Blockhead</title>
</svelte:head>


<Page>
	<EvmTopic_TimestampView
		href={
			resolve('/evm/topic/[hex=zeroExHex]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				hex: params.hex,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
