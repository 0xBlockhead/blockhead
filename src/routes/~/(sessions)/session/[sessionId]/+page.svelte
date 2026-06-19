<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Props
	let {
		params,
	} = $props()


	// Components
	import BlockheadSessionView from '$/views/BlockheadSessionView.svelte'
	import Page from '$/components/Page.svelte'
</script>


<Page>
	<BlockheadSessionView
		selection={select(EntityType.BlockheadSession, { id: params.sessionId })}
	/>
</Page>
