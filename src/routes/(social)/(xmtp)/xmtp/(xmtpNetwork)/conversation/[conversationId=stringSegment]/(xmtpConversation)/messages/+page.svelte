<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()
	// Components
	import Page from '$/components/Page.svelte'
	import XmtpMessagesView from '$/views/XmtpMessagesView.svelte'
</script>


<svelte:head>
	<title>XMTP messages • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.XmtpConversation, data.selector).$$messages}

	<XmtpMessagesView
		href={
			resolve(
				'/(social)/(xmtp)/xmtp/(xmtpNetwork)/conversation/[conversationId=stringSegment]/(xmtpConversation)/messages',
				{
					conversationId: params.conversationId,
				}
			)
		}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='messages'
	/>
</Page>
