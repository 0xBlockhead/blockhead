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
			'/~/zcash/wallet/[walletId=stringSegment]/viewing-key/[keyFingerprint=stringSegment]',
			{
				walletId: params.walletId,
				keyFingerprint: params.keyFingerprint,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import BlockheadZcashViewingKeyView from '$/views/BlockheadZcashViewingKeyView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if data?.selector != null}
			<BlockheadZcashViewingKeyView
				selection={
					select(EntityType.BlockheadZcashViewingKey, data.selector, {
						sources: [
							Source.Local_Internal,
							Source.ZcashClientBackend_Local,
							Source.ZcashdWallet_JsonRpc,
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
