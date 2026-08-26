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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.XmtpMessage, {
		id: params.id,
	}, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			contentText: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import XmtpMessageView from '$/views/XmtpMessageView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.id ?? '') || 'XMTP message' : [(pageSelection.entity.contentText ?? ''), pageSelection.entitySelector.id].filter(Boolean).join(' ') || 'XMTP message'} • XMTP message • Blockhead</title>
</svelte:head>


<Page>
	<XmtpMessageView
		selection={pageSelection}
	/>
</Page>
