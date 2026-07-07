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
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
</script>


<Page>
	<BeaconEpochView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/epoch/[epoch=nonNegativeInteger]', {
				caip2: params.caip2,
				epoch: params.epoch,
			})
		}
		selection={
			select(EntityType.BeaconEpoch, {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				epoch: Number(params.epoch),
			}, {
				sources: [
					Source.Beacon_Rest,
					Source.BeaconchaIn_Rest,
				],
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
