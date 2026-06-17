<script lang="ts">
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconEpochsView from '$/views/BeaconEpochsView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
</script>


<Page>
	<BeaconEpochsView
		entityFieldReference={{
			entityType: EntityType.EvmNetwork,
			selector: { caip2: { namespace: 'eip155', reference: params.caip2.slice('eip155:'.length) } },
			fieldName: '$$beaconEpochs',
		}}
		id="beacon-epochs"
	/>
</Page>
