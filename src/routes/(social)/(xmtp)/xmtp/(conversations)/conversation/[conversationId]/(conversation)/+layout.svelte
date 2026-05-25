<script lang="ts">
	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// Props
	let {
		children,
	} = $props()


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	title="Conversation"
	href={resolve(`/xmtp/conversation/${page.params.conversationId}`)}
	id={page.params.conversationId}
>
	{@render children()}
</ParentPageCollapsible>
