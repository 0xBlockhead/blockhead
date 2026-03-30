<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAgentConversationView from '$/views/BlockheadAgentConversationView.svelte'
</script>


<Page>
	<BlockheadAgentConversationView
		entityId={{ id: params.agentId }}
		href={resolve('/(explore)/(agents)/agent/[agentId]', params)}
	/>
</Page>
