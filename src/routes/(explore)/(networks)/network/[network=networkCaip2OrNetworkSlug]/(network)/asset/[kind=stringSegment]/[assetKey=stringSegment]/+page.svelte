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

	const pageSelection = $derived(select(EntityType.AssetInstance, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			symbol: true,
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'Asset instance' : [pageSelection.entity.symbol, pageSelection.entity.name].filter(Boolean).join(' ') || 'Asset instance')} • Asset instance • Blockhead</title>
</svelte:head>


<Page>
	<AssetInstanceView
		selection={pageSelection}
	/>
</Page>
