<script lang="ts">
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
		selector={{ id: params.conversationId }}
	/>
</Page>
