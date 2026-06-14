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
			selector: { caip2: { namespace: params.caip2Namespace, reference: params.caip2Reference } },
			fieldName: '$$beaconSlots',
		}}
		id="beacon-slots"
	/>
</Page>
