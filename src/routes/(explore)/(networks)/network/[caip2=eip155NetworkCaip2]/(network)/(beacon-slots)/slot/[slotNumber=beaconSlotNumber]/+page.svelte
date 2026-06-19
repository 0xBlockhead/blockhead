<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	import { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'
	// State
	let { params } = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconSlotView from '$/views/BeaconSlotView.svelte'
</script>


<Page>
		<BeaconSlotView
			selection={select(EntityType.BeaconSlot, {
			$network: eip155NetworkSelectorFromCaip2(params.caip2),
			slot: Number(params.slotNumber),
		})}
	/>
</Page>
