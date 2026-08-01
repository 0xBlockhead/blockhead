<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadSessionsView from '$/views/BlockheadSessionsView.svelte'
</script>


<svelte:head>
	<title>Sessions • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$blockheadSessions',
	})
		.$$blockheadSessions({
			sources: [
				Source.Local_Internal,
			],
		})}

	<BlockheadSessionsView
		href={resolve('/~/sessions')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='blockhead-sessions'
	/>
</Page>
