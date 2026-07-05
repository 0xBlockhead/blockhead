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
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
</script>


<svelte:head>
	<title>beacon epoch • Blockhead</title>
</svelte:head>


<Page>
	<BeaconEpochView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/epoch/[epoch=nonNegativeInteger]', {
				caip2: params.caip2,
				epoch: params.epoch,
			})
		}
		selection={
			select(EntityType.BeaconEpoch, data.selector, {
				fields: {
					startSlot: true,
					endSlot: true,
					slotCount: true,
					finalized: true,
					globalParticipationRate: true,
					validatorsCount: true,
					attestationsCount: true,
					withdrawalsCount: true,
					attesterSlashingsCount: true,
					proposerSlashingsCount: true,
				},
			})
		}
	/>
</Page>
