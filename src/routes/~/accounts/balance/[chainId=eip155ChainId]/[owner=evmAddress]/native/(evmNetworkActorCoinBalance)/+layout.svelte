<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()

	const detailHref = $derived(
		resolve(
			'/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/native',
			{
				chainId: params.chainId,
				owner: params.owner,
			}
		)
	)
	const detailSelection = $derived(data?.selector == null ? undefined : select(EntityType.EvmNetworkActorCoinBalance, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
	}))


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import EvmNetworkActorCoinBalanceView from '$/views/EvmNetworkActorCoinBalanceView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if detailSelection != null}
			<EvmNetworkActorCoinBalanceView
				selection={detailSelection}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
