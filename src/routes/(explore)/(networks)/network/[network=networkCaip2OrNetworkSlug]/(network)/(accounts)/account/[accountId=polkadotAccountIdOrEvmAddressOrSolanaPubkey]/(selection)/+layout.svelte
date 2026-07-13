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
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import SolanaAccountView from '$/views/SolanaAccountView.svelte'
</script>


{#key [params.network, params.accountId].join(':')}
	<ParentPageCollapsible
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrEvmAddressOrSolanaPubkey]', {
				network: params.network,
				accountId: params.accountId,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = data.selectorMapping.entityType === EntityType.PolkadotAccount ? PolkadotAccountView : data.selectorMapping.entityType === EntityType.EvmNetworkAccount ? EvmNetworkAccountView : SolanaAccountView}

			<DetailView
				selection={select(data.selectorMapping.entityType, data.selectorMapping.selector)}
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrEvmAddressOrSolanaPubkey]', {
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
