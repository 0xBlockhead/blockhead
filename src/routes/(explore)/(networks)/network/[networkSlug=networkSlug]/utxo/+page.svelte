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
	import UtxoNetworkView from '$/views/UtxoNetworkView.svelte'
</script>


<svelte:head>
	<title>UTXO network • Blockhead</title>
</svelte:head>


<Page>
	<UtxoNetworkView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo', {
				networkSlug: params.networkSlug,
			})
		}
		selection={select(EntityType.UtxoNetwork, data.selector)}
	/>
</Page>
