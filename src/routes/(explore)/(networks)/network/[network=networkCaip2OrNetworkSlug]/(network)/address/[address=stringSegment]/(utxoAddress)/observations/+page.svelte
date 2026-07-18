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
	import UtxoAddress_TimestampsView from '$/views/UtxoAddress_TimestampsView.svelte'
</script>


<svelte:head>
	<title>UTXO address observations • Blockhead</title>
</svelte:head>


<Page>
	<UtxoAddress_TimestampsView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/address/[address=stringSegment]/observations', {
				network: params.network,
				address: params.address,
			})
		}
		title='UTXO address observations'
		selection={
			select(EntityType.UtxoAddress, data.selector).$$timestamps({
				count: true,
			})
		}
		id='timestamps'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
