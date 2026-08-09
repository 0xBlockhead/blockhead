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
			'/~/accounts/allowance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]/[spender=evmAddress]',
			{
				chainId: params.chainId,
				owner: params.owner,
				coin: params.coin,
				spender: params.spender,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import EvmActorCoinAllowanceView from '$/views/EvmActorCoinAllowanceView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		<EvmActorCoinAllowanceView
			selection={
				select(EntityType.EvmActorCoinAllowance, data.selector, {
					sources: [
						Source.EnvioHyperSync_RawHttp,
						Source.SqdPortal_RawHttp,
						Source.Voltaire_JsonRpc,
					],
				})
			}
			href={detailHref}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
