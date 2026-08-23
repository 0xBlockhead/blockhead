<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
			'/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]',
			{
				chainId: params.chainId,
				owner: params.owner,
				coin: params.coin,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import EvmNetworkActorCoinBalanceView from '$/views/EvmNetworkActorCoinBalanceView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if data?.selector != null}
			<EvmNetworkActorCoinBalanceView
				selection={
					select(EntityType.EvmNetworkActorCoinBalance, data.selector, {
						sources: [
							Source.Constants_Internal,
						],
					})
				}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
