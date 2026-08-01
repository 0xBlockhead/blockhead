<!-- Generated from APP.ts. -->

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


	// Components
	import Page from '$/components/Page.svelte'
	import EvmError_TimestampView from '$/views/EvmError_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? 'EVM error observation' : pageSelection.entity.signatures.values.join(', ') || 'EVM error observation'} • EVM error observation • Blockhead</title>
</svelte:head>


<Page>
	<EvmError_TimestampView
		selection={pageSelection}
	/>
</Page>
