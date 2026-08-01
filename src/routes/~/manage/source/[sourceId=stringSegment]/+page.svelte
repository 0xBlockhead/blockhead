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

	const pageSelection = $derived(select(EntityType.BlockheadSource, {
		id: params.sourceId,
	}, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			label: true,
			source: true,
			provider: true,
			endpointUrl: true,
			transportKind: true,
			authKind: true,
			corsMode: true,
			proxyMode: true,
			environmentScope: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadSourceView from '$/views/BlockheadSourceView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.id ?? '') || 'source' : (pageSelection.entity.label ?? '') || pageSelection.entitySelector.id || 'source'} • source • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadSourceView
		selection={pageSelection}
	/>
</Page>
