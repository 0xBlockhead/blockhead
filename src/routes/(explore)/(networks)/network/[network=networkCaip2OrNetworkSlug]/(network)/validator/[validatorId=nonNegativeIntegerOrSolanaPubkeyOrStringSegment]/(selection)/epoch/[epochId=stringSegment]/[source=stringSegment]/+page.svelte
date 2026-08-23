<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
	import NearValidator_TimestampView from '$/views/NearValidator_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.NearValidator_Timestamp, {
					$validator: data.selector,
					epochId: params.epochId,
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.epochId || 'near validator timestamp')} • near validator timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'near validator timestamp'} • near validator timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.NearValidator_Timestamp, {
					$validator: data.selector,
					epochId: params.epochId,
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<NearValidator_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
