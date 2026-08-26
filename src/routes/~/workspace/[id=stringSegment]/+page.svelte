<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadWorkspace, {
		id: params.id,
	}, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadWorkspaceView from '$/views/BlockheadWorkspaceView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.id ?? '') || 'workspace' : (pageSelection.entity.name ?? '') || pageSelection.entitySelector.id || 'workspace'} • workspace • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadWorkspaceView
		selection={pageSelection}
	/>
</Page>
