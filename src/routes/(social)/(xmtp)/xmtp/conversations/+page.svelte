<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import XmtpConversationsView from '$/views/XmtpConversationsView.svelte'
</script>


<Page>
	<XmtpConversationsView
		href={resolve('/xmtp/conversations')}
		id="conversations"
	/>
</Page>
