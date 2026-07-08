<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	<title>Blocks • Blockhead</title>
</svelte:head>


<Page>
	<UtxoBlocksView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/blocks', {
				networkSlug: params.networkSlug,
			})
		}
		title='Blocks'
		selection={
			select(EntityType.Network, {
				slug: params.networkSlug,
			}).Utxo.$$blocks({
				sources: [
					Source.Voltaire_JsonRpc,
					Source.Blockscout_Rest,
				],
			})
		}
		id='blocks'
	/>
</Page>
