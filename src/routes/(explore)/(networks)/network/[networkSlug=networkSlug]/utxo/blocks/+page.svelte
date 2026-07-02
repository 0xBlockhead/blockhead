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
	import UtxoBlocksView from '$/views/UtxoBlocksView.svelte'
</script>


<svelte:head>
	<title>UTXO blocks • Blockhead</title>
</svelte:head>


<Page>
	<UtxoBlocksView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/blocks', {
				networkSlug: params.networkSlug,
			})
		}
		title='UTXO blocks'
		selection={
			select(EntityType.UtxoNetwork, {
				$network: {
					slug: params.networkSlug,
				},
			})[EntityProxyField]<EntityType.UtxoBlock>('$$blocks')
		}
		id='UtxoBlocksView-page'
	/>
</Page>
