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

	const pageSelection = $derived(select(EntityType.XmtpConversation, {
		id: params.conversationId,
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
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import XmtpConversationView from '$/views/XmtpConversationView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? [String(({
		id: params.conversationId,
	}.id) ?? '')].filter(Boolean).join(' ') || 'XMTP conversation' : [String((({ ...{
		id: params.conversationId,
	}, ...pageSelection.entity }).topic) ?? ''), String((({ ...{
		id: params.conversationId,
	}, ...pageSelection.entity }).peerInboxId) ?? ''), String((({ ...{
		id: params.conversationId,
	}, ...pageSelection.entity }).id) ?? '')].filter(Boolean).join(' ') || 'XMTP conversation')} • XMTP conversation • Blockhead</title>
</svelte:head>


<Page>
	<XmtpConversationView
		href={
			resolve('/xmtp/conversation/[conversationId=stringSegment]', {
				conversationId: params.conversationId,
			})
		}
		selection={pageSelection}
	/>
</Page>
