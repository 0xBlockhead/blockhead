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

	const pageSelection = $derived(select(EntityType.BlockheadAction, {
		id: params.actionId,
	}, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			contentRevisionHash: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadActionView from '$/views/BlockheadActionView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? 'blockhead action' : pageSelection.entity.contentRevisionHash || 'blockhead action'} • blockhead action • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadActionView
		selection={pageSelection}
	/>
</Page>
