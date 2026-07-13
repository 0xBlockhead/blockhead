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

	const pageSelection = $derived(select(EntityType.Network_Timestamp, {
		$network: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
		$network: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
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
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.timestampMs) ?? '')].filter(Boolean).join(' ') || 'Network timestamp' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).timestampMs) ?? '')].filter(Boolean).join(' ') || 'Network timestamp')))


	// Components
	import Page from '$/components/Page.svelte'
	import Network_TimestampView from '$/views/Network_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Network timestamp • Blockhead</title>
</svelte:head>


<Page>
	<Network_TimestampView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				network: params.network,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
