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


	// Components
	import Page from '$/components/Page.svelte'
	import EvmError_TimestampView from '$/views/EvmError_TimestampView.svelte'
</script>


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
			select(EntityType.EvmError_Timestamp, {
				$error: {
					hex: decodeURIComponent(params.hex),
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			}, {
				sources: [({
				$error: {
					hex: decodeURIComponent(params.hex),
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			}).source],
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
