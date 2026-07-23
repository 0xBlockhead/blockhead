<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZcashShieldedActionKind } from '$/schema/ZcashShieldedAction.ts'
	import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPool.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.ZcashShieldedAction, data.selector, {
		fields: {
			nullifier: true,
			noteCommitment: true,
			$pool: true,
			valueCommitment: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ZcashShieldedActionView from '$/views/ZcashShieldedActionView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.actionKind) ?? ''), String((data.selector.indexInTransaction) ?? '')].filter(Boolean).join(' ') || 'Zcash shielded action' : [String((({ ...data.selector, ...pageSelection.entity }).actionKind) ?? ''), String((({ ...data.selector, ...pageSelection.entity }).indexInTransaction) ?? '')].filter(Boolean).join(' ') || 'Zcash shielded action'))} • Zcash shielded action • Blockhead</title>
</svelte:head>


<Page>
	<ZcashShieldedActionView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/shielded-action/[pool=stringSegment]/[actionKind=stringSegment]/[actionIndex=nonNegativeInteger]', {
				network: params.network,
				transactionId: params.transactionId,
				pool: params.pool,
				actionKind: params.actionKind,
				actionIndex: params.actionIndex,
			})
		}
		selection={pageSelection}
	/>
</Page>
