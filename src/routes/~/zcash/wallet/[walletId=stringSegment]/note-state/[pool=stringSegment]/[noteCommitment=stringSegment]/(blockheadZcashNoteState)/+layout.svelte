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
			'/~/zcash/wallet/[walletId=stringSegment]/note-state/[pool=stringSegment]/[noteCommitment=stringSegment]',
			{
				walletId: params.walletId,
				pool: params.pool,
				noteCommitment: params.noteCommitment,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import BlockheadZcashNoteStateView from '$/views/BlockheadZcashNoteStateView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if data?.selector != null}
			{#key data.selector}
				<BlockheadZcashNoteStateView
					selection={
						untrack(() => select(EntityType.BlockheadZcashNoteState, data.selector, {
							sources: [
								Source.Local_Internal,
								Source.ZcashClientBackend_Local,
								Source.ZcashLightwalletd_Grpc,
								Source.ZcashdWallet_JsonRpc,
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
