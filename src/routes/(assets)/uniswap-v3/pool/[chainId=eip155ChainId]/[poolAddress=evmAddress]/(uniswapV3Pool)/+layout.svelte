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
			'/(assets)/uniswap-v3/pool/[chainId=eip155ChainId]/[poolAddress=evmAddress]',
			{
				chainId: params.chainId,
				poolAddress: params.poolAddress,
			}
		)
	)
	const detailSelection = $derived(data?.selector == null ? undefined : select(EntityType.UniswapV3Pool, data.selector, {
		sources: [
			Source.Voltaire_JsonRpc,
			Source.UniswapContracts_Evm,
		],
	}))


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import UniswapV3PoolView from '$/views/UniswapV3PoolView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if detailSelection != null}
			<UniswapV3PoolView
				selection={detailSelection}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
