<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

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
		entityId={{ id: params.channelId }}
		href={resolve('/(assets)/(channels)/channel/[channelId]', params)}
	/>
</Page>
