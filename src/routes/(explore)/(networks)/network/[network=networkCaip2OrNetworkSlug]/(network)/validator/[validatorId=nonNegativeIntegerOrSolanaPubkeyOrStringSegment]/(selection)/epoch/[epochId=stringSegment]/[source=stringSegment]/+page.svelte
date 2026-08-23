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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.NearValidator_Timestamp, {
		$validator: data.selector,
		epochId: params.epochId,
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import NearValidator_TimestampView from '$/views/NearValidator_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.epochId || 'near validator timestamp')} • near validator timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'near validator timestamp'} • near validator timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<NearValidator_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
