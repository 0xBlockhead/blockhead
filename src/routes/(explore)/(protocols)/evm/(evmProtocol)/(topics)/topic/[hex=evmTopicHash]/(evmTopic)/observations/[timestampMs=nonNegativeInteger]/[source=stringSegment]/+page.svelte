<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EvmTopic_Timestamp, {
		$topic: {
			hex: params.hex,
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$topic: {
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


	// Components
	import Page from '$/components/Page.svelte'
	import EvmTopic_TimestampView from '$/views/EvmTopic_TimestampView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? 'EVM topic observation' : pageSelection.entity.signatures.values.join(', ') || 'EVM topic observation')} • EVM topic observation • Blockhead</title>
</svelte:head>


<Page>
	<EvmTopic_TimestampView
		selection={pageSelection}
	/>
</Page>
