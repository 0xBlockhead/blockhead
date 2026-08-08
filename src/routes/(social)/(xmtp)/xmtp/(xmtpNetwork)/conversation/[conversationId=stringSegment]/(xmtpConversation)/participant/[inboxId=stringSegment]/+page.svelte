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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.XmtpParticipant, {
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
	<title>{data.title ?? (pageSelection.entitySelector.inboxId || 'XMTP participant')} • XMTP participant • Blockhead</title>
</svelte:head>


<Page>
	<XmtpParticipantView
		selection={pageSelection}
	/>
</Page>
