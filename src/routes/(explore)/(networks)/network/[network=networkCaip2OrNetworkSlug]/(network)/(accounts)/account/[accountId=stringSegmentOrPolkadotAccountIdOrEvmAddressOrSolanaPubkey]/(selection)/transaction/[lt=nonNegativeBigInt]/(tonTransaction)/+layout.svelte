<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/transaction/[lt=nonNegativeBigInt]',
			{
				network: params.network,
				accountId: params.accountId,
				lt: params.lt,
			}
		)
	)
	const detailSelection = $derived(data?.selector == null ? undefined : select(EntityType.TonTransaction, data.selector))


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import TonTransactionView from '$/views/TonTransactionView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if detailSelection != null}
			<TonTransactionView
				selection={detailSelection}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
