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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.OciDescriptor, {
		$manifest: {
			registry: params.registry,
			repository: decodeURIComponent(params.repository),
			reference: decodeURIComponent(params.reference),
		},
		descriptorKind: params.descriptorKind,
		descriptorIndex: Number(params.descriptorIndex),
	}, {
		sources: [
			Source.OciRegistry_Distribution,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import OciDescriptorView from '$/views/OciDescriptorView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.descriptorKind || 'OCI descriptor'} • OCI descriptor • Blockhead</title>
</svelte:head>


<Page>
	<OciDescriptorView
		selection={pageSelection}
	/>
</Page>
