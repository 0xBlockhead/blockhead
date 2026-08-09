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

	const pageSelection = $derived(select(EntityType.RegulatedAssetProfile, data.selector, {
		fields: {
			standard: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import RegulatedAssetProfileView from '$/views/RegulatedAssetProfileView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'regulated asset profile' : pageSelection.entity.standard || 'regulated asset profile')} • regulated asset profile • Blockhead</title>
</svelte:head>


<Page>
	<RegulatedAssetProfileView
		selection={pageSelection}
	/>
</Page>
