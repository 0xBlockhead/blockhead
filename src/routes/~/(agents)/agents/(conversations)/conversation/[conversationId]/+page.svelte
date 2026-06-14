<script lang="ts">
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
		selector={{ id: params.conversationId }}
	/>
</Page>
