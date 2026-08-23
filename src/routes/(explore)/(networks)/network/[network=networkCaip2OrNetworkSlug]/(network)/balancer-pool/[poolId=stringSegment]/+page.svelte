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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BalancerPoolView from '$/views/BalancerPoolView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BalancerPool, data.selector, {
					sources: [
						Source.Balancer_Rest,
					],
					fields: {
						name: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'Balancer pool' : pageSelection.entity.name || 'Balancer pool')} • Balancer pool • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Balancer pool'} • Balancer pool • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BalancerPool, data.selector, {
					sources: [
						Source.Balancer_Rest,
					],
					fields: {
						name: true,
					},
				}))}

		<BalancerPoolView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
