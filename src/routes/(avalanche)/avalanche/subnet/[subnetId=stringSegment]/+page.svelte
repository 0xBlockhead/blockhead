<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.AvalancheSubnet, data.selector, {
		fields: {
			label: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AvalancheSubnetView from '$/views/AvalancheSubnetView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.subnetId ?? '') || 'avalanche subnet' : (pageSelection.entity.label ?? '') || pageSelection.entitySelector.subnetId || 'avalanche subnet')} • avalanche subnet • Blockhead</title>
</svelte:head>


<Page>
	<AvalancheSubnetView
		selection={pageSelection}
	/>
</Page>
