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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BalancerPool, data.selector, {
		sources: [
			Source.Balancer_Rest,
		],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BalancerPoolView from '$/views/BalancerPoolView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Balancer pool' : pageSelection.entity.name || 'Balancer pool')} • Balancer pool • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Balancer pool'} • Balancer pool • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BalancerPoolView
		selection={pageSelection}
	/>
	{/if}
</Page>
