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
	import PolkadotNetwork_TimestampView from '$/views/PolkadotNetwork_TimestampView.svelte'
</script>


<svelte:head>
	<title>Polkadot network timestamp • Blockhead</title>
</svelte:head>


<Page>
	<PolkadotNetwork_TimestampView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/observation/[timestampMs=nonNegativeInteger]/[source]', {
				networkSlug: params.networkSlug,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.PolkadotNetwork_Timestamp, data.selector, {
				sources: [data.selector.source],
				fields: {
					runtimeSpecName: true,
					finalizedBlockNumber: true,
					isSyncing: true,
					peerCount: true,
					runtimeSpecVersion: true,
					transactionVersion: true,
					stateVersion: true,
					finalizedBlockHash: true,
					finalizedExtrinsicCount: true,
					shouldHavePeers: true,
				},
			})
		}
	/>
</Page>
