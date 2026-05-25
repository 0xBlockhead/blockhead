<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import XmtpConversationsView from '$/views/XmtpConversationsView.svelte'
</script>


<Page>
	<XmtpConversationsView
		href={resolve('/xmtp')}
		entityFieldReference={{
			entityType: EntityType.XmtpNetwork,
			entityId: { scope: 'XmtpNetwork' },
			fieldName: '$$xmtpConversations',
		}}
		id="conversations"
	/>
</Page>
