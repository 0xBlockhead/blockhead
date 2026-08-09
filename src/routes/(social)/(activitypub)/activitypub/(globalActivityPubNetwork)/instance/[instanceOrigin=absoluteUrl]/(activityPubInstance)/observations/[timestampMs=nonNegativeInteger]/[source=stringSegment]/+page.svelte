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
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.ActivityPubInstance_Timestamp, data.selector, {
		sources: [data.selector.source],
		fields: {
			title: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubInstance_TimestampView from '$/views/ActivityPubInstance_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.timestampMs ?? '') || 'ActivityPub instance observation' : [(pageSelection.entity.title ?? ''), String(pageSelection.entitySelector.timestampMs)].filter(Boolean).join(' ') || 'ActivityPub instance observation')} • ActivityPub instance observation • Blockhead</title>
</svelte:head>


<Page>
	<ActivityPubInstance_TimestampView
		selection={pageSelection}
	/>
</Page>
