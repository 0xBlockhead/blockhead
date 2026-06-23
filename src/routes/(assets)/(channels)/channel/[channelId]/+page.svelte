<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadStateChannelView from '$/views/BlockheadStateChannelView.svelte'
</script>


<Page>
	<BlockheadStateChannelView
		selection={select(EntityType.BlockheadStateChannel, { id: params.channelId })}
	/>
</Page>
