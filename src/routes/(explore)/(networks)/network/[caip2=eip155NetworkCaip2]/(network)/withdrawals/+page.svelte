<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
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
	import BeaconWithdrawalsView from '$/views/BeaconWithdrawalsView.svelte'
</script>


<svelte:head>
	<title>Beacon withdrawals • Blockhead</title>
</svelte:head>


<Page>
	<BeaconWithdrawalsView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/withdrawals', {
				caip2: params.caip2,
			})
		}
		title='Beacon withdrawals'
		selection={
			select(EntityType.Network, {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			}).Evm.$$beaconWithdrawals({
				sources: [
					Source.Beacon_Rest,
				],
			})
		}
		id='beacon-withdrawals'
	/>
</Page>
