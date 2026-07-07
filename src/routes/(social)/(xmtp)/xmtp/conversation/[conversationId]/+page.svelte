<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import XmtpConversationView from '$/views/XmtpConversationView.svelte'
</script>


<Page>
	<XmtpConversationView
		href={
			resolve('/(social)/(xmtp)/xmtp/conversation/[conversationId]', {
				conversationId: params.conversationId,
			})
		}
		selection={
			select(EntityType.XmtpConversation, {
				id: decodeURIComponent(params.conversationId),
			}, {
				sources: [
					Source.Local_Internal,
				],
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
