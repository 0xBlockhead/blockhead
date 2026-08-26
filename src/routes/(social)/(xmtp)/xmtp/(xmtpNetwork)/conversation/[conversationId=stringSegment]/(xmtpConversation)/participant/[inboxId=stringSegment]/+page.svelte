<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.XmtpParticipant, {
		$conversation: data.selector,
		inboxId: params.inboxId,
	}, {
		sources: [
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import XmtpParticipantView from '$/views/XmtpParticipantView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.inboxId || 'XMTP participant')} • XMTP participant • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'XMTP participant'} • XMTP participant • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<XmtpParticipantView
		selection={pageSelection}
	/>
	{/if}
</Page>
