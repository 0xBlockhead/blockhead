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
	import BlockheadBridgeIntentView from '$/views/BlockheadBridgeIntentView.svelte'
</script>


<svelte:head>
	<title>blockhead bridge intent • blockhead bridge intent • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadBridgeIntentView
		selection={
			select(EntityType.BlockheadBridgeIntent, {
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
