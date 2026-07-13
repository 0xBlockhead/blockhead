<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadPanelTree, {
		id: params.dashboardId,
	}, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			$workspace: true,
		},
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? [String((pageSelection.entitySelector.id) ?? '')].filter(Boolean).join(' ') || 'dashboard' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).id) ?? '')].filter(Boolean).join(' ') || 'dashboard'))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadPanelTreeView from '$/views/BlockheadPanelTreeView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • dashboard • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadPanelTreeView
		href={
			resolve('/~/dashboard/[dashboardId=stringSegment]', {
				dashboardId: params.dashboardId,
			})
		}
		selection={pageSelection}
	/>
</Page>
