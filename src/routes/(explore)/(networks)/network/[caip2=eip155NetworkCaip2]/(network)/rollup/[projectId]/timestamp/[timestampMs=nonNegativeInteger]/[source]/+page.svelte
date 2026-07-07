<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2SelectorValueFromString } from '$/lib/caip2.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmRollup_TimestampView from '$/views/EvmRollup_TimestampView.svelte'
</script>


<Page>
	<EvmRollup_TimestampView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/rollup/[projectId]/timestamp/[timestampMs=nonNegativeInteger]/[source]', {
				caip2: params.caip2,
				projectId: params.projectId,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.EvmRollup_Timestamp, {
				$rollup: {
					$network: {
						caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
					},
					projectId: decodeURIComponent(params.projectId),
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			}, {
				sources: [({
				$rollup: {
					$network: {
						caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
					},
					projectId: decodeURIComponent(params.projectId),
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			}).source],
				fields: {
					listingStage: true,
					isArchived: true,
					isUpcoming: true,
					isUnderReview: true,
					sourceUpdatedAt: true,
				},
			})
		}
	/>
</Page>
