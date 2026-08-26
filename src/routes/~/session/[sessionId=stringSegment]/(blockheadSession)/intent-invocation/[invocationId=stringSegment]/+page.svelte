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

	const pageSelection = $derived(select(EntityType.BlockheadIntentInvocation, {
		sessionId: params.sessionId,
		invocationId: params.invocationId,
	}, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			modality: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadIntentInvocationView from '$/views/BlockheadIntentInvocationView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? 'blockhead intent invocation' : pageSelection.entity.modality || 'blockhead intent invocation'} • blockhead intent invocation • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadIntentInvocationView
		selection={pageSelection}
	/>
</Page>
