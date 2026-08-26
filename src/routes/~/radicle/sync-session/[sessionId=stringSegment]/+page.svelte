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

	const pageSelection = $derived(select(EntityType.BlockheadRadicleSyncSession, {
		sessionId: params.sessionId,
	}, {
		sources: [
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadRadicleSyncSessionView from '$/views/BlockheadRadicleSyncSessionView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.sessionId || 'blockhead radicle sync session'} • blockhead radicle sync session • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadRadicleSyncSessionView
		selection={pageSelection}
	/>
</Page>
