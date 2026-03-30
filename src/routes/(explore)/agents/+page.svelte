<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAgentConversationsView from '$/views/BlockheadAgentConversationsView.svelte'
</script>


<Page>
	<BlockheadAgentConversationsView
		href={resolve('/agents')}
		id="agents"
	/>
</Page>
