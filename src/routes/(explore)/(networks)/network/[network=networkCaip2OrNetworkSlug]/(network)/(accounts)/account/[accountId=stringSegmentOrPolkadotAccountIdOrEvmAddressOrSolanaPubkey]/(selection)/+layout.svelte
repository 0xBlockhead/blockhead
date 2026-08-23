<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()

	const detailHref = $derived(
		resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]',
			{
				network: params.network,
				accountId: params.accountId,
			}
		)
	)
	const detailSelection = $derived(data?.selector == null ? undefined : select(data.entityType, data.selector))


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import AptosAccountView from '$/views/AptosAccountView.svelte'
	import PolkadotAccountView from '$/views/PolkadotAccountView.svelte'
	import CosmosAccountView from '$/views/CosmosAccountView.svelte'
	import HederaAccountView from '$/views/HederaAccountView.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import SolanaAccountView from '$/views/SolanaAccountView.svelte'
	import StarknetContractView from '$/views/StarknetContractView.svelte'
	import TronAccountView from '$/views/TronAccountView.svelte'
	import TonAccountView from '$/views/TonAccountView.svelte'
	import XrplAccountView from '$/views/XrplAccountView.svelte'
	import NearAccountView from '$/views/NearAccountView.svelte'
	import HyperliquidAccountView from '$/views/HyperliquidAccountView.svelte'
	import QuilibriumAccountView from '$/views/QuilibriumAccountView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if detailSelection != null}
			{@const DetailView = data.entityType === EntityType.AptosAccount ? AptosAccountView : data.entityType === EntityType.PolkadotAccount ? PolkadotAccountView : data.entityType === EntityType.CosmosAccount ? CosmosAccountView : data.entityType === EntityType.HederaAccount ? HederaAccountView : data.entityType === EntityType.EvmNetworkAccount ? EvmNetworkAccountView : data.entityType === EntityType.SolanaAccount ? SolanaAccountView : data.entityType === EntityType.StarknetContract ? StarknetContractView : data.entityType === EntityType.TronAccount ? TronAccountView : data.entityType === EntityType.TonAccount ? TonAccountView : data.entityType === EntityType.XrplAccount ? XrplAccountView : data.entityType === EntityType.NearAccount ? NearAccountView : data.entityType === EntityType.HyperliquidAccount ? HyperliquidAccountView : QuilibriumAccountView}

			<DetailView
				selection={detailSelection}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
