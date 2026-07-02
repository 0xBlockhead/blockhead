<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import XmtpConversationView from '$/views/XmtpConversationView.svelte'
</script>


<svelte:head>
	<title>XMTP conversation • Blockhead</title>
</svelte:head>


<Page>
	<XmtpConversationView
		href={
			resolve('/(social)/(xmtp)/xmtp/conversation/[conversationId]', {
				conversationId: params.conversationId,
			})
		}
		selection={
			select(EntityType.XmtpConversation, data.selector, {
				fields: {
					topic: true,
					peerInboxId: true,
					createdAtMs: true,
					consentState: true,
				},
			})
		}
	/>
</Page>
