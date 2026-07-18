<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { NetworkExecutionModel, NetworkLedgerModel } from '$/constants/Network.ts'


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
			ledgerModels: true,
			executionModels: true,
			Cosmos: {
				fields: {
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
					bondedValidatorCount: true,
					bondedTokens: true,
					notBondedTokens: true,
				},
			},
			Polkadot: {
				fields: {
					finalizedBlockNumber: true,
					finalizedBlockHash: true,
					finalizedExtrinsicCount: true,
					runtimeSpecName: true,
					runtimeSpecVersion: true,
					transactionVersion: true,
					stateVersion: true,
					peerCount: true,
					isSyncing: true,
					shouldHavePeers: true,
				},
			},
			Solana: {
				fields: {
					health: true,
					absoluteSlot: true,
					blockHeight: true,
					epoch: true,
					slotIndex: true,
					slotsInEpoch: true,
					transactionCount: true,
					currentValidatorCount: true,
					delinquentValidatorCount: true,
					totalActivatedStakeLamports: true,
					solanaCoreVersion: true,
					featureSet: true,
				},
			},
			Utxo: {
				fields: {
					bestBlockHeight: true,
					bestBlockHash: true,
					bestBlockTimeMs: true,
					blockCount: true,
					transactionCount: true,
					blocks24h: true,
					transactions24h: true,
					mempoolTransactionCount: true,
					mempoolSizeBytes: true,
					mempoolTps: true,
					averageTransactionFee24hSats: true,
					medianTransactionFee24hSats: true,
					suggestedTransactionFeePerByteSats: true,
					blockchainSizeBytes: true,
				},
			},
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
