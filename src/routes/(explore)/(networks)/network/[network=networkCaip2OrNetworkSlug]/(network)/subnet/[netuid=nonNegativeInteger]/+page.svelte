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
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BittensorSubnet, data.selector, {
		sources: [
			Source.Constants_Internal,
			Source.Bittensor_JsonRpc,
		],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BittensorSubnetView from '$/views/BittensorSubnetView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.netuid ?? '') || 'Bittensor subnet' : [(pageSelection.entity.name ?? ''), String(pageSelection.entitySelector.netuid)].filter(Boolean).join(' ') || 'Bittensor subnet')} • Bittensor subnet • Blockhead</title>
</svelte:head>


<Page>
	<BittensorSubnetView
		selection={pageSelection}
	/>
</Page>
