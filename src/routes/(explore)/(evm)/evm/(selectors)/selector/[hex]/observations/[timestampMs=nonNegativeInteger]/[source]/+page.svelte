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
	import EvmSelector_TimestampView from '$/views/EvmSelector_TimestampView.svelte'
</script>


<svelte:head>
	<title>EVM selector observation • Blockhead</title>
</svelte:head>


<Page>
	<EvmSelector_TimestampView
		href={
			resolve('/(explore)/(evm)/evm/(selectors)/selector/[hex]/observations/[timestampMs=nonNegativeInteger]/[source]', {
				hex: params.hex,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.EvmSelector_Timestamp, data.selector, {
				sources: [data.selector.source],
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
