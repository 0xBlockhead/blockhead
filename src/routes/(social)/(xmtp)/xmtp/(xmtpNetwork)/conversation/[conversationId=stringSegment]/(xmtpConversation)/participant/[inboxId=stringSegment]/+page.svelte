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
	import XmtpParticipantView from '$/views/XmtpParticipantView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.XmtpParticipant, {
					$conversation: data.selector,
					inboxId: params.inboxId,
				}, {
					sources: [
						Source.Local_Internal,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.inboxId || 'XMTP participant')} • XMTP participant • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'XMTP participant'} • XMTP participant • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.XmtpParticipant, {
					$conversation: data.selector,
					inboxId: params.inboxId,
				}, {
					sources: [
						Source.Local_Internal,
					],
				}))}

		<XmtpParticipantView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
