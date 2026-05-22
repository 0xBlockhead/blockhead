<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import XmtpConversationsView from '$/views/XmtpConversationsView.svelte'
</script>


<Page>
	<XmtpConversationsView
		entityFieldReference={{
			entityType: EntityType.XmtpNetwork,
			entityId: { scope: 'XmtpNetwork' },
			fieldName: '$$xmtpConversations',
		}}
		href={resolve('/xmtp/conversations')}
		id="conversations"
	/>
</Page>
