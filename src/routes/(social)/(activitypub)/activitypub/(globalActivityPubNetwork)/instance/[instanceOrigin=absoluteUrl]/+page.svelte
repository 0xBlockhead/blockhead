<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.ActivityPubInstance, data.selector, {
		sources: [
			Source.Mastodon_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubInstanceView from '$/views/ActivityPubInstanceView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (String(pageSelection.entitySelector.instanceOrigin) || 'ActivityPub instance'))} • ActivityPub instance • Blockhead</title>
</svelte:head>


<Page>
	<ActivityPubInstanceView
		selection={pageSelection}
	/>
</Page>
