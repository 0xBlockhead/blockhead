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
			'/cctp/message/[sourceDomain=nonNegativeInteger]/[nonce=stringSegment]',
			{
				sourceDomain: params.sourceDomain,
				nonce: params.nonce,
			}
		)
	)
	const detailSelection = $derived(data?.selector == null ? undefined : select(EntityType.CctpMessage, data.selector, {
		sources: [
			Source.CircleCctpContracts_Evm,
			Source.CircleCctpContracts_Solana,
			Source.CircleCctpContracts_Stellar,
			Source.CircleCctpIris,
		],
	}))


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import CctpMessageView from '$/views/CctpMessageView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if detailSelection != null}
			<CctpMessageView
				selection={detailSelection}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
