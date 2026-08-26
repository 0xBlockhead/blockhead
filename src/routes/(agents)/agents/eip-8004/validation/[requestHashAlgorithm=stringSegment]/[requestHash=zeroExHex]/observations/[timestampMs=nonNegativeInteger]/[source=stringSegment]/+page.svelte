<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.Eip8004Validation_Timestamp, {
		requestHashAlgorithm: params.requestHashAlgorithm,
		requestHash: params.requestHash,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import Eip8004Validation_TimestampView from '$/views/Eip8004Validation_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.requestHash || 'EIP-8004 validation timestamp'} • EIP-8004 validation timestamp • Blockhead</title>
</svelte:head>


<Page>
	<Eip8004Validation_TimestampView
		selection={pageSelection}
	/>
</Page>
