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
	import UtxoInputsView from '$/views/UtxoInputsView.svelte'
</script>


<svelte:head>
	<title>UTXO inputs • Blockhead</title>
</svelte:head>


<Page>
	<UtxoInputsView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/inputs', {
				networkSlug: params.networkSlug,
				txId: params.txId,
			})
		}
		title='UTXO inputs'
		selection={
			select(EntityType.UtxoTransaction, {
				$network: {
					slug: params.networkSlug,
				},
				txId: decodeURIComponent(params.txId),
			})[EntityProxyField]<EntityType.UtxoInput>('$$inputs')
		}
		id='UtxoInputsView-page'
	/>
</Page>
