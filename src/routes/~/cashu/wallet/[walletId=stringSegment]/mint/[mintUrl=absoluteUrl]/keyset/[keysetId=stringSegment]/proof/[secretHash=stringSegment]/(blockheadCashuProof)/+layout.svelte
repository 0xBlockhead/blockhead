<!-- Generated from APP.ts. -->

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

	const detailHref = $derived(
		resolve(
			'/~/cashu/wallet/[walletId=stringSegment]/mint/[mintUrl=absoluteUrl]/keyset/[keysetId=stringSegment]/proof/[secretHash=stringSegment]',
			{
				walletId: params.walletId,
				mintUrl: params.mintUrl,
				keysetId: params.keysetId,
				secretHash: params.secretHash,
			}
		)
	)
	const detailSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadCashuProof, data.selector))


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import BlockheadCashuProofView from '$/views/BlockheadCashuProofView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if detailSelection != null}
			<BlockheadCashuProofView
				selection={detailSelection}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
