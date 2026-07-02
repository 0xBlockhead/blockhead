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
	import UtxoAddress_TimestampsView from '$/views/UtxoAddress_TimestampsView.svelte'
</script>


<svelte:head>
	<title>UTXO address observations • Blockhead</title>
</svelte:head>


<Page>
	<UtxoAddress_TimestampsView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/address/[address]/observations', {
				networkSlug: params.networkSlug,
				address: params.address,
			})
		}
		title='UTXO address observations'
		selection={
			select(EntityType.UtxoAddress, {
				$network: {
					slug: params.networkSlug,
				},
				address: decodeURIComponent(params.address),
			})[EntityProxyField]<EntityType.UtxoAddress_Timestamp>('$$timestamps')
		}
		id='UtxoAddress_TimestampsView-page'
	/>
</Page>
