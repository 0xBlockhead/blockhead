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

	const pageSelection = $derived(select(EntityType.EvmError_Timestamp, {
		$error: {
			hex: params.hex,
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$error: {
				hex: params.hex,
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
	const pageEntityTitle = $derived((pageSelection.entity == null ? 'EVM error observation' : 'EVM error observation'))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmError_TimestampView from '$/views/EvmError_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • EVM error observation • Blockhead</title>
</svelte:head>


<Page>
	<EvmError_TimestampView
		href={
			resolve('/evm/error/[hex=zeroExHex]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				hex: params.hex,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
