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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BalancerPoolTokenView from '$/views/BalancerPoolTokenView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BalancerPoolToken, {
				$pool: data.selector,
				tokenIndex: Number(params.index),
			}, {
				sources: [
					Source.Balancer_Rest,
				],
				fields: {
					symbol: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Balancer pool reserve token' : pageSelection.entity.symbol || 'Balancer pool reserve token')} • Balancer pool reserve token • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Balancer pool reserve token'} • Balancer pool reserve token • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BalancerPoolToken, {
				$pool: data.selector,
				tokenIndex: Number(params.index),
			}, {
				sources: [
					Source.Balancer_Rest,
				],
				fields: {
					symbol: true,
				},
			})}

	<BalancerPoolTokenView
		selection={pageSelection}
	/>
	{/if}
</Page>
