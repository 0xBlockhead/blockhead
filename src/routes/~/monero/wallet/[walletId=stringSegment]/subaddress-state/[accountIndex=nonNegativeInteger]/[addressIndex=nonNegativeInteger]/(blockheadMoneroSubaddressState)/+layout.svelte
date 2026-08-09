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
			'/~/monero/wallet/[walletId=stringSegment]/subaddress-state/[accountIndex=nonNegativeInteger]/[addressIndex=nonNegativeInteger]',
			{
				walletId: params.walletId,
				accountIndex: params.accountIndex,
				addressIndex: params.addressIndex,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import BlockheadMoneroSubaddressStateView from '$/views/BlockheadMoneroSubaddressStateView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		<BlockheadMoneroSubaddressStateView
			selection={
				select(EntityType.BlockheadMoneroSubaddressState, data.selector, {
					sources: [
						Source.Local_Internal,
					],
				})
			}
			href={detailHref}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
