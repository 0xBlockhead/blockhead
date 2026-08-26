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
	import XmtpParticipantsView from '$/views/XmtpParticipantsView.svelte'
</script>


<svelte:head>
	<title>XMTP participants • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.XmtpConversation, data.selector).$$participants}

	<XmtpParticipantsView
		href={
			resolve(
				'/(social)/(xmtp)/xmtp/(xmtpNetwork)/conversation/[conversationId=stringSegment]/(xmtpConversation)/participants',
				{
					conversationId: params.conversationId,
				}
			)
		}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='participants'
	/>
</Page>
