<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import XmtpConversationView from '$/views/XmtpConversationView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.XmtpConversation, data.selector, {
					sources: [
						Source.Local_Internal,
					],
					fields: {
						topic: true,
						peerInboxId: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.id ?? '') || 'XMTP conversation' : [(pageSelection.entity.topic ?? ''), (pageSelection.entity.peerInboxId ?? ''), pageSelection.entitySelector.id].filter(Boolean).join(' ') || 'XMTP conversation')} • XMTP conversation • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'XMTP conversation'} • XMTP conversation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.XmtpConversation, data.selector, {
					sources: [
						Source.Local_Internal,
					],
					fields: {
						topic: true,
						peerInboxId: true,
					},
				}))}

		<XmtpConversationView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
