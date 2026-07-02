<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import UtxoAddressView from '$/views/UtxoAddressView.svelte'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
</script>


<svelte:head>
	<title>Address • Blockhead</title>
</svelte:head>


<Page>
	<UtxoAddressView
		selection={select(EntityType.UtxoAddress, {
			$network: { slug: params.networkSlug },
			address: params.address,
		})}
		open={true}
	/>
</Page>
