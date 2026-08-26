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


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadSwapIntentView from '$/views/BlockheadSwapIntentView.svelte'
</script>


<svelte:head>
	<title>blockhead swap intent • blockhead swap intent • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadSwapIntentView
		selection={
			select(EntityType.BlockheadSwapIntent, {
				sessionId: params.sessionId,
				actionId: params.actionId,
			}, {
				sources: [
					Source.Local_Internal,
				],
			})
		}
	/>
</Page>
