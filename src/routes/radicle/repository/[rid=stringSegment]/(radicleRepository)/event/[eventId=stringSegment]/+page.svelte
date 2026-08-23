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
	import RadicleCollaborationEventView from '$/views/RadicleCollaborationEventView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.RadicleCollaborationEvent, {
					$repository: data.selector,
					eventId: params.eventId,
				}))}
			<title>{data?.title ?? 'radicle collaboration event'} • radicle collaboration event • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'radicle collaboration event'} • radicle collaboration event • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.RadicleCollaborationEvent, {
					$repository: data.selector,
					eventId: params.eventId,
				}))}

		<RadicleCollaborationEventView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
