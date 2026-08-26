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
	import BeaconWithdrawalsView from '$/views/BeaconWithdrawalsView.svelte'
</script>


<svelte:head>
	<title>Beacon withdrawals • Blockhead</title>
</svelte:head>


<Page>
	<BeaconWithdrawalsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/withdrawals',
				{
					network: params.network,
				}
			)
		}
		title='Beacon withdrawals'
		selection={select(EntityType.Network, data.selector).Evm.$$beaconWithdrawals}
		id='beacon-withdrawals'
	/>
</Page>
