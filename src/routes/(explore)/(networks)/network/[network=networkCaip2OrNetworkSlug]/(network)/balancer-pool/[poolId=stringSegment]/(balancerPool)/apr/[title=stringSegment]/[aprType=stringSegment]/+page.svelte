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
	import BalancerPoolAprItemView from '$/views/BalancerPoolAprItemView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BalancerPoolAprItem, {
					$pool: data.selector,
					title: params.title,
					aprType: params.aprType,
				}, {
					sources: [
						Source.Balancer_Rest,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.title || 'Balancer pool APR item')} • Balancer pool APR item • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Balancer pool APR item'} • Balancer pool APR item • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BalancerPoolAprItem, {
					$pool: data.selector,
					title: params.title,
					aprType: params.aprType,
				}, {
					sources: [
						Source.Balancer_Rest,
					],
				}))}

		<BalancerPoolAprItemView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
