<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Props
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
		id="beacon-slots"
	/>
</Page>

