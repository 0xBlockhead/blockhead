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
	import CosmosValidator_TimestampView from '$/views/CosmosValidator_TimestampView.svelte'
</script>


<Page>
	<CosmosValidator_TimestampView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/validator/[operatorAddress]/observations/[timestampMs=nonNegativeInteger]/[source]', {
				caip2: params.caip2,
				operatorAddress: params.operatorAddress,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.CosmosValidator_Timestamp, {
				$validator: {
					$network: {
						caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
					},
					operatorAddress: decodeURIComponent(params.operatorAddress),
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			}, {
				sources: [({
				$validator: {
					$network: {
						caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
					},
					operatorAddress: decodeURIComponent(params.operatorAddress),
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			}).source],
				fields: {
					status: true,
					tokens: true,
					jailed: true,
					delegatorShares: true,
					commissionRate: true,
					minSelfDelegation: true,
				},
			})
		}
	/>
</Page>
