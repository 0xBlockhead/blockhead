<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.XmtpConversation, data.selector, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			topic: true,
			peerInboxId: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import XmtpConversationView from '$/views/XmtpConversationView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.id ?? '') || 'XMTP conversation' : [(pageSelection.entity.topic ?? ''), (pageSelection.entity.peerInboxId ?? ''), pageSelection.entitySelector.id].filter(Boolean).join(' ') || 'XMTP conversation')} • XMTP conversation • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'XMTP conversation'} • XMTP conversation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<XmtpConversationView
		selection={pageSelection}
	/>
	{/if}
</Page>
