<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType._GlobalActivityPubNetwork_Timestamp, {
		$hub: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
		fields: {
			instanceTitle: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalActivityPubNetwork_TimestampView from '$/views/_GlobalActivityPubNetwork_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.timestampMs ?? '') || 'global ActivityPub network timestamp' : [(pageSelection.entity.instanceTitle ?? ''), String(pageSelection.entitySelector.timestampMs)].filter(Boolean).join(' ') || 'global ActivityPub network timestamp')} • global ActivityPub network timestamp • Blockhead</title>
</svelte:head>


<Page>
	<GlobalActivityPubNetwork_TimestampView
		selection={pageSelection}
	/>
</Page>
