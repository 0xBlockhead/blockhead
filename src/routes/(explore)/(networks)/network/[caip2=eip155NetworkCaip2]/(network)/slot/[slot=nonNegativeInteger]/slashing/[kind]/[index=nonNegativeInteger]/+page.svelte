<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2SelectorValueFromString } from '$/lib/caip2.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconSlashingView from '$/views/BeaconSlashingView.svelte'
</script>


<Page>
	<BeaconSlashingView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/slot/[slot=nonNegativeInteger]/slashing/[kind]/[index=nonNegativeInteger]', {
				caip2: params.caip2,
				slot: params.slot,
				kind: params.kind,
				index: params.index,
			})
		}
		selection={
			select(EntityType.BeaconSlashing, {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				slot: Number(params.slot),
				kind: decodeURIComponent(params.kind),
				indexInSlot: Number(params.index),
			})
		}
	/>
</Page>
