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
	import CosmosAccount_TimestampView from '$/views/CosmosAccount_TimestampView.svelte'
</script>


<svelte:head>
	<title>Cosmos account timestamp • Blockhead</title>
</svelte:head>


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
			select(EntityType.CosmosAccount_Timestamp, data.selector, {
				fields: {
					accountNumber: true,
					sequence: true,
				},
			})
		}
	/>
</Page>
