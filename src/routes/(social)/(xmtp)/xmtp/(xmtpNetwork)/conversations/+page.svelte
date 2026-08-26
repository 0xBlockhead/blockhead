<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// Components
	import Page from '$/components/Page.svelte'
	import XmtpConversationsView from '$/views/XmtpConversationsView.svelte'
</script>


<svelte:head>
	<title>XMTP conversations • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.XmtpNetwork, {
		scope: 'XmtpNetwork',
	}).$$xmtpConversations}

	<XmtpConversationsView
		href={resolve('/(social)/(xmtp)/xmtp/(xmtpNetwork)/conversations')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='xmtp-conversations'
	/>
</Page>
