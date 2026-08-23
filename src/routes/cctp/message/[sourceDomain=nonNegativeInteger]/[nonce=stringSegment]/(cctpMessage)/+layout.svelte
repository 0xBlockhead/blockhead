<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


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


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import CctpMessageView from '$/views/CctpMessageView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if data?.selector != null}
			{#key data.selector}
				<CctpMessageView
					selection={
						untrack(() => select(EntityType.CctpMessage, data.selector, {
							sources: [
								Source.CircleCctpContracts_Evm,
								Source.CircleCctpContracts_Solana,
								Source.CircleCctpContracts_Stellar,
								Source.CircleCctpIris,
							],
						}))
					}
					href={detailHref}
					layout={EntityLayout.SummaryInline}
				/>
			{/key}
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
