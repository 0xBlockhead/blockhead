<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import XmtpConversationView from '$/views/XmtpConversationView.svelte'
</script>


<Page>
	<XmtpConversationView
		entityId={{ id: params.conversationId }}
	/>
</Page>
