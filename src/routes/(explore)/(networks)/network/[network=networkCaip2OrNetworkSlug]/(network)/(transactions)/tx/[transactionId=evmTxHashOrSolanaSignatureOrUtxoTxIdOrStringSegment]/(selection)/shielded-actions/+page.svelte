<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()
	// Components
	import Page from '$/components/Page.svelte'
	import ZcashShieldedActionsView from '$/views/ZcashShieldedActionsView.svelte'
</script>


<svelte:head>
	<title>Zcash shielded actions • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.UtxoTransaction, data.selector).$$zcashShieldedActions}

	<ZcashShieldedActionsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/shielded-actions',
				{
					network: params.network,
					transactionId: params.transactionId,
				}
			)
		}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='zcash-shielded-actions'
	/>
</Page>
