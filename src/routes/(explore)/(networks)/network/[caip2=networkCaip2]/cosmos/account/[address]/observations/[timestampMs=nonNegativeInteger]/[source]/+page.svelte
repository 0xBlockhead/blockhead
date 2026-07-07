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
	import CosmosAccount_TimestampView from '$/views/CosmosAccount_TimestampView.svelte'
</script>


<Page>
	<CosmosAccount_TimestampView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/account/[address]/observations/[timestampMs=nonNegativeInteger]/[source]', {
				caip2: params.caip2,
				address: params.address,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.CosmosAccount_Timestamp, {
				$account: {
					$network: {
						caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
					},
					address: decodeURIComponent(params.address),
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			}, {
				sources: [({
				$account: {
					$network: {
						caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
					},
					address: decodeURIComponent(params.address),
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			}).source],
				fields: {
					accountNumber: true,
					sequence: true,
				},
			})
		}
	/>
</Page>
