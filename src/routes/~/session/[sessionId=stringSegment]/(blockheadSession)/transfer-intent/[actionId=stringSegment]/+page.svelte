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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadTransferIntentView from '$/views/BlockheadTransferIntentView.svelte'
</script>


<svelte:head>
	<title>blockhead transfer intent • blockhead transfer intent • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadTransferIntentView
		selection={
			select(EntityType.BlockheadTransferIntent, {
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
