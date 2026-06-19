<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import StateChannelView from '$/views/StateChannelView.svelte'
</script>


<Page>
	<StateChannelView
		selection={select(EntityType.StateChannel, { id: params.channelId })}
	/>
</Page>
