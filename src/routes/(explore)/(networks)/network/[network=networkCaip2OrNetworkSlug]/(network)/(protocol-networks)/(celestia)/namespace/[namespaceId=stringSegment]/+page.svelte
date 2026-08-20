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

	const pageSelection = $derived(select(EntityType.CelestiaNamespace, data.selector, {
		sources: [
			Source.Celenium_Rest,
		],
		fields: {
			label: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CelestiaNamespaceView from '$/views/CelestiaNamespaceView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.namespaceId ?? '') || 'celestia namespace' : (pageSelection.entity.label ?? '') || pageSelection.entitySelector.namespaceId || 'celestia namespace')} • celestia namespace • Blockhead</title>
</svelte:head>


<Page>
	<CelestiaNamespaceView
		selection={pageSelection}
	/>
</Page>
