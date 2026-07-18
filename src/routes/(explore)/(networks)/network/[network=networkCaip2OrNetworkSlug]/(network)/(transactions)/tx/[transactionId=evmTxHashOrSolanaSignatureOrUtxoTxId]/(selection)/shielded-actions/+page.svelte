<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
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
	<ZcashShieldedActionsView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/shielded-actions', {
				network: params.network,
				transactionId: params.transactionId,
			})
		}
		title='Zcash shielded actions'
		selection={
			select(EntityType.UtxoTransaction, data.selector).$$zcashShieldedActions({
				count: true,
			})
		}
		id='zcash-shielded-actions'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
