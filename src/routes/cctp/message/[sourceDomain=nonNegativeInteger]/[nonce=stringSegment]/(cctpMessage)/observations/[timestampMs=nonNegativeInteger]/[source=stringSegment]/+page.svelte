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

	const pageSelection = $derived(select(EntityType.CctpAttestation_Timestamp, {
		$message: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CctpAttestation_TimestampView from '$/views/CctpAttestation_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'CCTP attestation timestamp')} • CCTP attestation timestamp • Blockhead</title>
</svelte:head>


<Page>
	<CctpAttestation_TimestampView
		selection={pageSelection}
	/>
</Page>
