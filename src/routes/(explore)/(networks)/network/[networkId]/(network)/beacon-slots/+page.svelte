<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconSlotsView from '$/views/BeaconSlotsView.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
		<BeaconSlotsView
		entityFieldReference={{
			entityType: EntityType.Network,
			entityId: { chainId: Number(params.networkId) },
			fieldName: '$$beaconSlots',
		}}
		href={resolve('/(explore)/(networks)/network/[networkId]/(network)/beacon-slots', params)}
		id="beacon-slots"
	/>
</Page>

