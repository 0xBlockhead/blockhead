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
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
				network: params.network,
				accountId: params.accountId,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = data.entityType === EntityType.PolkadotAccount && data.selectorName === 'NetworkAccountId' ? PolkadotAccountView : data.entityType === EntityType.CosmosAccount && data.selectorName === 'NetworkAddress' ? CosmosAccountView : data.entityType === EntityType.HederaAccount && data.selectorName === 'NetworkAccountId' ? HederaAccountView : data.entityType === EntityType.CardanoAddress && data.selectorName === 'NetworkAddress' ? CardanoAddressView : data.entityType === EntityType.EvmNetworkAccount && data.selectorName === 'EvmNetworkEvmAccount' ? EvmNetworkAccountView : data.entityType === EntityType.SolanaAccount && data.selectorName === 'NetworkPubkey' ? SolanaAccountView : data.entityType === EntityType.TonAccount && data.selectorName === 'NetworkAddress' ? TonAccountView : XrplAccountView}

			<DetailView
				selection={select(data.entityType, data.selector)}
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
						network: params.network,
						accountId: params.accountId,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
