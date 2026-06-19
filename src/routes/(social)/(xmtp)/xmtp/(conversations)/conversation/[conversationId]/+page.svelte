<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
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
		selection={select(EntityType.XmtpConversation, { id: params.conversationId })}
	/>
</Page>
