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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BalancerPoolAprItem, {
		$pool: data.selector,
		title: params.title,
		aprType: params.aprType,
	}, {
		sources: [
			Source.Balancer_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BalancerPoolAprItemView from '$/views/BalancerPoolAprItemView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.title || 'Balancer pool APR item')} • Balancer pool APR item • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Balancer pool APR item'} • Balancer pool APR item • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BalancerPoolAprItemView
		selection={pageSelection}
	/>
	{/if}
</Page>
