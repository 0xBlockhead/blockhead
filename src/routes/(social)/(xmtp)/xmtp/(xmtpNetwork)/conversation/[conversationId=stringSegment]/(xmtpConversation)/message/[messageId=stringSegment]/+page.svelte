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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import XmtpMessageView from '$/views/XmtpMessageView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.XmtpMessage, {
					$conversation: data.selector,
					id: params.messageId,
				}, {
					sources: [
						Source.Local_Internal,
					],
					fields: {
						contentText: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.id ?? '') || 'XMTP message' : [(pageSelection.entity.contentText ?? ''), pageSelection.entitySelector.id].filter(Boolean).join(' ') || 'XMTP message')} • XMTP message • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'XMTP message'} • XMTP message • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.XmtpMessage, {
					$conversation: data.selector,
					id: params.messageId,
				}, {
					sources: [
						Source.Local_Internal,
					],
					fields: {
						contentText: true,
					},
				}))}

		<XmtpMessageView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
