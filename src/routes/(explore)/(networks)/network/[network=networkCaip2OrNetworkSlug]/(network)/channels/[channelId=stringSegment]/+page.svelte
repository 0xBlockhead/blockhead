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
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.LightningChannel, data.selector, {
		sources: [
			Source.LightningMempoolSpace_Rest,
			Source.LightningLnd_Rest,
			Source.Amboss_Graphql,
		],
		fields: {
			shortChannelId: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LightningChannelView from '$/views/LightningChannelView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.channelId ?? '') || 'Lightning channel' : (pageSelection.entity.shortChannelId ?? '') || pageSelection.entitySelector.channelId || 'Lightning channel')} • Lightning channel • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Lightning channel'} • Lightning channel • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<LightningChannelView
		selection={pageSelection}
	/>
	{/if}
</Page>
