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
	import BeaconSlotView from '$/views/BeaconSlotView.svelte'
</script>


<svelte:head>
	<title>beacon slot • Blockhead</title>
</svelte:head>


<Page>
	<BeaconSlotView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/slot/[slot=nonNegativeInteger]', {
				caip2: params.caip2,
				slot: params.slot,
			})
		}
		selection={
			select(EntityType.BeaconSlot, data.selector, {
				fields: {
					epoch: true,
					proposerIndex: true,
					root: true,
					canonical: true,
					parentRoot: true,
					stateRoot: true,
					bodyRoot: true,
					signature: true,
				},
			})
		}
	/>
</Page>
