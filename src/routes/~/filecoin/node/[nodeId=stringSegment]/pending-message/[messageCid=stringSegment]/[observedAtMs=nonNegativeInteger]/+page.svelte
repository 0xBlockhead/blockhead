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

	const pageSelection = $derived(select(EntityType.BlockheadFilecoinPendingMessage, {
		nodeId: params.nodeId,
		messageCid: params.messageCid,
		observedAtMs: Number(params.observedAtMs),
	}, {
		sources: [
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadFilecoinPendingMessageView from '$/views/BlockheadFilecoinPendingMessageView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.messageCid || 'blockhead filecoin pending message'} • blockhead filecoin pending message • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadFilecoinPendingMessageView
		selection={pageSelection}
	/>
</Page>
