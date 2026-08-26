<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()
	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotReferendumsView from '$/views/PolkadotReferendumsView.svelte'
</script>


<svelte:head>
	<title>Polkadot referenda • Blockhead</title>
</svelte:head>


<Page>
	<PolkadotReferendumsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(polkadot)/referenda',
				{
					network: params.network,
				}
			)
		}
		title='Polkadot referenda'
		selection={select(EntityType.Network, data.selector).Polkadot.$$referenda}
		id='referenda'
	/>
</Page>
