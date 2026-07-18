<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data.selectorMapping.entityType === EntityType.PolkadotAccount && data.selectorMapping.selectorName === 'NetworkAccountId' ? select(EntityType.PolkadotAccount, data.selectorMapping.selector, {
		sources: [
			Source.SubstrateSidecar_Rest,
		],
	}) : data.selectorMapping.entityType === EntityType.CosmosAccount && data.selectorMapping.selectorName === 'NetworkAddress' ? select(EntityType.CosmosAccount, data.selectorMapping.selector) : data.selectorMapping.entityType === EntityType.EvmNetworkAccount && data.selectorMapping.selectorName === 'EvmNetworkEvmAccount' ? select(EntityType.EvmNetworkAccount, data.selectorMapping.selector) : data.selectorMapping.entityType === EntityType.SolanaAccount && data.selectorMapping.selectorName === 'NetworkPubkey' ? select(EntityType.SolanaAccount, data.selectorMapping.selector, {
		sources: [
			Source.Solana_JsonRpc,
		],
	}) : data.selectorMapping.entityType === EntityType.TonAccount && data.selectorMapping.selectorName === 'NetworkAddress' ? select(EntityType.TonAccount, data.selectorMapping.selector, {
		fields: {
			workchain: true,
			addressHash: true,
		},
	}) : data.selectorMapping.entityType === EntityType.XrplAccount && data.selectorMapping.selectorName === 'NetworkAccount' ? select(EntityType.XrplAccount, data.selectorMapping.selector) : undefined)
	const pageEntityTitle = $derived(data.selectorMapping.entityType === EntityType.PolkadotAccount && data.selectorMapping.selectorName === 'NetworkAccountId' ? (pageSelection.entity == null ? [String((pageSelection.entitySelector.accountId) ?? '')].filter(Boolean).join(' ') || 'Polkadot account' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).accountId) ?? '')].filter(Boolean).join(' ') || 'Polkadot account') : data.selectorMapping.entityType === EntityType.CosmosAccount && data.selectorMapping.selectorName === 'NetworkAddress' ? (pageSelection.entity == null ? [String((pageSelection.entitySelector.address) ?? '')].filter(Boolean).join(' ') || 'Cosmos account' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).address) ?? '')].filter(Boolean).join(' ') || 'Cosmos account') : data.selectorMapping.entityType === EntityType.EvmNetworkAccount && data.selectorMapping.selectorName === 'EvmNetworkEvmAccount' ? (pageSelection.entity == null ? 'EVM network account' : 'EVM network account') : data.selectorMapping.entityType === EntityType.SolanaAccount && data.selectorMapping.selectorName === 'NetworkPubkey' ? (pageSelection.entity == null ? [String((pageSelection.entitySelector.pubkey) ?? '')].filter(Boolean).join(' ') || 'solana account' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).pubkey) ?? '')].filter(Boolean).join(' ') || 'solana account') : data.selectorMapping.entityType === EntityType.TonAccount && data.selectorMapping.selectorName === 'NetworkAddress' ? (pageSelection.entity == null ? 'TON account' : 'TON account') : data.selectorMapping.entityType === EntityType.XrplAccount && data.selectorMapping.selectorName === 'NetworkAccount' ? (pageSelection.entity == null ? 'XRPL account' : 'XRPL account') : 'Blockhead')
	const pageEntityTypeLabel = $derived(data.selectorMapping.entityType === EntityType.PolkadotAccount && data.selectorMapping.selectorName === 'NetworkAccountId' ? 'Polkadot account' : data.selectorMapping.entityType === EntityType.CosmosAccount && data.selectorMapping.selectorName === 'NetworkAddress' ? 'Cosmos account' : data.selectorMapping.entityType === EntityType.EvmNetworkAccount && data.selectorMapping.selectorName === 'EvmNetworkEvmAccount' ? 'EVM network account' : data.selectorMapping.entityType === EntityType.SolanaAccount && data.selectorMapping.selectorName === 'NetworkPubkey' ? 'solana account' : data.selectorMapping.entityType === EntityType.TonAccount && data.selectorMapping.selectorName === 'NetworkAddress' ? 'TON account' : data.selectorMapping.entityType === EntityType.XrplAccount && data.selectorMapping.selectorName === 'NetworkAccount' ? 'XRPL account' : 'Entity')

	// Components
	import Page from '$/components/Page.svelte'
	import { entityViewComponentByType } from '$/views/index.ts'
</script>


<svelte:head>
	<title>{pageEntityTitle} • {pageEntityTypeLabel} • Blockhead</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewComponentByType[data.selectorMapping.entityType]}

	<EntityView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
				network: params.network,
				accountId: params.accountId,
			})
		}
		selection={pageSelection}
	/>
</Page>
