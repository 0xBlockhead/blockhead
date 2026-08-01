<!-- Generated from APP.ts. Do not edit by hand. -->

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
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]',
			{
				network: params.network,
				accountId: params.accountId,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import PolkadotAccountView from '$/views/PolkadotAccountView.svelte'
	import CosmosAccountView from '$/views/CosmosAccountView.svelte'
	import HederaAccountView from '$/views/HederaAccountView.svelte'
	import CardanoAddressView from '$/views/CardanoAddressView.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import SolanaAccountView from '$/views/SolanaAccountView.svelte'
	import TonAccountView from '$/views/TonAccountView.svelte'
	import XrplAccountView from '$/views/XrplAccountView.svelte'
</script>


{#key [params.network, params.accountId].join(':')}
	<ParentPageCollapsible
		href={detailHref}
	>
		{#snippet Summary()}
			{@const DetailView = data.entityType === EntityType.PolkadotAccount ? PolkadotAccountView : data.entityType === EntityType.CosmosAccount ? CosmosAccountView : data.entityType === EntityType.HederaAccount ? HederaAccountView : data.entityType === EntityType.CardanoAddress ? CardanoAddressView : data.entityType === EntityType.EvmNetworkAccount ? EvmNetworkAccountView : data.entityType === EntityType.SolanaAccount ? SolanaAccountView : data.entityType === EntityType.TonAccount ? TonAccountView : XrplAccountView}

			<DetailView
				selection={select(data.entityType, data.selector)}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
