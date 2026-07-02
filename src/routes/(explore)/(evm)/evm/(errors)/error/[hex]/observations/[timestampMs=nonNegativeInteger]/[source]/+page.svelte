<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmError_TimestampView from '$/views/EvmError_TimestampView.svelte'
</script>


<svelte:head>
	<title>EVM error observation • Blockhead</title>
</svelte:head>


<Page>
	<EvmError_TimestampView
		href={
			resolve('/(explore)/(evm)/evm/(errors)/error/[hex]/observations/[timestampMs=nonNegativeInteger]/[source]', {
				hex: params.hex,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.EvmError_Timestamp, data.selector, {
				fields: {
					signatures: true,
					filteredSignatureCount: true,
					verifiedCandidateCount: true,
					reachable: true,
				},
			})
		}
	/>
</Page>
