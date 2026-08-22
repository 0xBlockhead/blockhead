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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.AssetClass, {
		$assetInstance: data.selector,
		classKind: params.classKind,
		classKey: params.classKey,
	}, {
		fields: {
			label: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AssetClassView from '$/views/AssetClassView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.classKey ?? '') || 'asset class' : [(pageSelection.entity.label ?? ''), pageSelection.entitySelector.classKey].filter(Boolean).join(' ') || 'asset class')} • asset class • Blockhead</title>
</svelte:head>


<Page>
	<AssetClassView
		selection={pageSelection}
	/>
</Page>
