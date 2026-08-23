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


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubInstanceView from '$/views/ActivityPubInstanceView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.ActivityPubInstance, data.selector, {
				sources: [
					Source.Mastodon_Rest,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.instanceOrigin || 'ActivityPub instance')} • ActivityPub instance • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ActivityPub instance'} • ActivityPub instance • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.ActivityPubInstance, data.selector, {
				sources: [
					Source.Mastodon_Rest,
				],
			})}

	<ActivityPubInstanceView
		selection={pageSelection}
	/>
	{/if}
</Page>
