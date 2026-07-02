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
	import CosmosNetwork_TimestampView from '$/views/CosmosNetwork_TimestampView.svelte'
</script>


<svelte:head>
	<title>Cosmos network timestamp • Blockhead</title>
</svelte:head>


<Page>
	<CosmosNetwork_TimestampView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/observations/[timestampMs=nonNegativeInteger]/[source]', {
				caip2: params.caip2,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.CosmosNetwork_Timestamp, data.selector, {
				fields: {
					latestBlockHeight: true,
					chainId: true,
					isSyncing: true,
					latestBlockHash: true,
					latestBlockTimeMs: true,
					latestBlockTransactionCount: true,
					nodeNetwork: true,
					applicationName: true,
					applicationVersion: true,
					cosmosSdkVersion: true,
					validatorCount: true,
					bondedValidatorCount: true,
					bondedTokens: true,
					notBondedTokens: true,
					governanceProposalCount: true,
				},
			})
		}
	/>
</Page>
