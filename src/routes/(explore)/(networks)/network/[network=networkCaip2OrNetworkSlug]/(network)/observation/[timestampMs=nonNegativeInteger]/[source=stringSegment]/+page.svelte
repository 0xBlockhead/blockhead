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
			Cosmos,latestBlockHeight: true,
			Cosmos,latestBlockHash: true,
			Cosmos,latestBlockTimeMs: true,
			Cosmos,latestBlockTransactionCount: true,
			Cosmos,chainId: true,
			Cosmos,nodeNetwork: true,
			Cosmos,applicationName: true,
			Cosmos,applicationVersion: true,
			Cosmos,cosmosSdkVersion: true,
			Cosmos,isSyncing: true,
			Cosmos,bondedValidatorCount: true,
			Cosmos,bondedTokens: true,
			Cosmos,notBondedTokens: true,
			Polkadot,finalizedBlockNumber: true,
			Polkadot,finalizedBlockHash: true,
			Polkadot,finalizedExtrinsicCount: true,
			Polkadot,runtimeSpecName: true,
			Polkadot,runtimeSpecVersion: true,
			Polkadot,transactionVersion: true,
			Polkadot,stateVersion: true,
			Polkadot,peerCount: true,
			Polkadot,isSyncing: true,
			Polkadot,shouldHavePeers: true,
			Solana,health: true,
			Solana,absoluteSlot: true,
			Solana,blockHeight: true,
			Solana,epoch: true,
			Solana,slotIndex: true,
			Solana,slotsInEpoch: true,
			Solana,transactionCount: true,
			Solana,currentValidatorCount: true,
			Solana,delinquentValidatorCount: true,
			Solana,totalActivatedStakeLamports: true,
			Solana,solanaCoreVersion: true,
			Solana,featureSet: true,
			Utxo,bestBlockHeight: true,
			Utxo,bestBlockHash: true,
			Utxo,bestBlockTimeMs: true,
			Utxo,blockCount: true,
			Utxo,transactionCount: true,
			Utxo,blocks24h: true,
			Utxo,transactions24h: true,
			Utxo,mempoolTransactionCount: true,
			Utxo,mempoolSizeBytes: true,
			Utxo,mempoolTps: true,
			Utxo,averageTransactionFee24hSats: true,
			Utxo,medianTransactionFee24hSats: true,
			Utxo,suggestedTransactionFeePerByteSats: true,
			Utxo,blockchainSizeBytes: true,
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
