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

	const pageSelection = $derived(select(EntityType.EvmSelector_Timestamp, {
		$selector: {
			hex: params.hex,
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$selector: {
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
	import EvmSelector_TimestampView from '$/views/EvmSelector_TimestampView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? 'EVM selector observation' : pageSelection.entity.signatures.values.join(', ') || 'EVM selector observation')} • EVM selector observation • Blockhead</title>
</svelte:head>


<Page>
	<EvmSelector_TimestampView
		selection={pageSelection}
	/>
</Page>
