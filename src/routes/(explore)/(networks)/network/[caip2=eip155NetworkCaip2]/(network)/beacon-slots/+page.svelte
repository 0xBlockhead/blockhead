<script lang="ts">
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconSlotsView from '$/views/BeaconSlotsView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
</script>


<Page>
	<BeaconSlotsView
		entityFieldReference={{
			entityType: EntityType.EvmNetwork,
			selector: { caip2: { namespace: 'eip155', reference: params.caip2.slice('eip155:'.length) } },
			fieldName: '$$beaconSlots',
		}}
		id="beacon-slots"
	/>
</Page>
