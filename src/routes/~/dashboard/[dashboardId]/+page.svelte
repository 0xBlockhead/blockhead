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


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadPanelTreeView from '$/views/BlockheadPanelTreeView.svelte'
</script>


<Page>
	<BlockheadPanelTreeView
		href={
			resolve('/~/dashboard/[dashboardId]', {
				dashboardId: params.dashboardId,
			})
		}
		selection={
			select(EntityType.BlockheadPanelTree, {
				id: params.dashboardId,
			}, {
				sources: [
					Source.Local_Internal,
				],
			})
		}
	/>
</Page>
