<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()
	// Components
	import Page from '$/components/Page.svelte'
	import BeaconSlashingsView from '$/views/BeaconSlashingsView.svelte'
</script>


<svelte:head>
	<title>Beacon slashings • Blockhead</title>
</svelte:head>


<Page>
	<BeaconSlashingsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slashings',
				{
					network: params.network,
				}
			)
		}
		title='Beacon slashings'
		selection={select(EntityType.Network, data.selector).Evm.$$beaconSlashings}
		id='beacon-slashings'
	/>
</Page>
