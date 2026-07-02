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
	import UtxoAddressView from '$/views/UtxoAddressView.svelte'
</script>


<svelte:head>
	<title>UTXO address • Blockhead</title>
</svelte:head>


<Page>
	<UtxoAddressView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/address/[address]', {
				networkSlug: params.networkSlug,
				address: params.address,
			})
		}
		selection={select(EntityType.UtxoAddress, data.selector)}
	/>
</Page>
