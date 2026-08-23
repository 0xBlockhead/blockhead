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
			'/~/logos/connection/[connectionId=stringSegment]/node-state/[peerId=stringSegment]/(blockheadLogosBlockchainNodeState)/wallet-key/[publicKey=zeroExHex]',
			{
				connectionId: params.connectionId,
				peerId: params.peerId,
				publicKey: params.publicKey,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import BlockheadLogosBlockchainWalletKeyStateView from '$/views/BlockheadLogosBlockchainWalletKeyStateView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if data?.selector != null}
			<BlockheadLogosBlockchainWalletKeyStateView
				selection={
					select(EntityType.BlockheadLogosBlockchainWalletKeyState, data.selector, {
						sources: [
							Source.Local_Internal,
							Source.LogosBlockchainNode_Rest,
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
