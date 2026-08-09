<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BittensorNeuron, {
		$subnet: data.selector,
		uid: Number(params.uid),
	}, {
		sources: [
			Source.Bittensor_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BittensorNeuronView from '$/views/BittensorNeuronView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.uid) || 'Bittensor neuron')} • Bittensor neuron • Blockhead</title>
</svelte:head>


<Page>
	<BittensorNeuronView
		selection={pageSelection}
	/>
</Page>
