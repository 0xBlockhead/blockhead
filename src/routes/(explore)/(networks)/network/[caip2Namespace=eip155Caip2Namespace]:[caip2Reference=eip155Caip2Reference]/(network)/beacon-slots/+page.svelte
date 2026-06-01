<script lang="ts">
	// Types/constants
	import { networkIdFromCaip2RouteParams } from '$/lib/caip.ts'


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
			entityType: EntityType.EvmNetwork,
			entityId: networkIdFromCaip2RouteParams(params),
			fieldName: '$$beaconSlots',
		}}
		id="beacon-slots"
	/>
</Page>

