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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import Network_TimestampView from '$/views/Network_TimestampView.svelte'
</script>


<Page>
	<Network_TimestampView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/observations/[timestampMs=nonNegativeInteger]/[source]', {
				networkSlug: params.networkSlug,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.Network_Timestamp, {
				$network: {
					slug: params.networkSlug,
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			}, {
				sources: [({
				$network: {
					slug: params.networkSlug,
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			}).source],
				fields: {
					latestHeight: true,
					health: true,
					txCount: true,
					latestBlockHeight: true,
					latestBlockHash: true,
					latestBlockTimeMs: true,
					latestBlockTransactionCount: true,
					chainId: true,
					nodeNetwork: true,
					applicationName: true,
					applicationVersion: true,
					cosmosSdkVersion: true,
					isSyncing: true,
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
