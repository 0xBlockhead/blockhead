<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import XmtpConversationsView from '$/views/XmtpConversationsView.svelte'
</script>


<Page>
	<XmtpConversationsView
		href={resolve('/xmtp')}
		selection={select(
			EntityType.XmtpNetwork,
			{ scope: 'XmtpNetwork' }
		).$$xmtpConversations}
		id="conversations"
	/>
</Page>
