<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadPanelTreeView from '$/views/BlockheadPanelTreeView.svelte'
</script>


<svelte:head>
	<title>dashboard • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadPanelTreeView
		href={
			resolve('/~/dashboard/[dashboardId]', {
				dashboardId: params.dashboardId,
			})
		}
		selection={select(EntityType.BlockheadPanelTree, data.selector)}
	/>
</Page>
