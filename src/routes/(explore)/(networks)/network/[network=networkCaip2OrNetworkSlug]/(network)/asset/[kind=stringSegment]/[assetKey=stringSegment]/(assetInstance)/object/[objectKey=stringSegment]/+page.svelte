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

	const pageSelection = $derived(select(EntityType.AssetObject, {
		$assetInstance: data.selector,
		objectKey: params.objectKey,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AssetObjectView from '$/views/AssetObjectView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.objectKey || 'asset object')} • asset object • Blockhead</title>
</svelte:head>


<Page>
	<AssetObjectView
		selection={pageSelection}
	/>
</Page>
