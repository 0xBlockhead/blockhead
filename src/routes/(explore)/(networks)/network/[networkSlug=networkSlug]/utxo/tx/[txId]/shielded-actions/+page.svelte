<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
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
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/shielded-actions', {
				networkSlug: params.networkSlug,
				txId: params.txId,
			})
		}
		title='Zcash shielded actions'
		selection={
			select(EntityType.UtxoTransaction, {
				$network: {
					slug: params.networkSlug,
				},
				txId: decodeURIComponent(params.txId),
			})[EntityProxyField]<EntityType.ZcashShieldedAction>('$$zcashShieldedActions')
		}
		id='zcash-shielded-actions'
	/>
</Page>
