<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	import BalancerPoolEventView from '$/views/BalancerPoolEventView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BalancerPoolEvent, {
					$pool: data.selector,
					eventId: decodeURIComponent(params.eventId),
				}, {
					sources: [
						Source.Balancer_Rest,
					],
					fields: {
						eventType: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'Balancer pool event' : pageSelection.entity.eventType || 'Balancer pool event')} • Balancer pool event • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Balancer pool event'} • Balancer pool event • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BalancerPoolEvent, {
					$pool: data.selector,
					eventId: decodeURIComponent(params.eventId),
				}, {
					sources: [
						Source.Balancer_Rest,
					],
					fields: {
						eventType: true,
					},
				}))}

		<BalancerPoolEventView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
