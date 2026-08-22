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

	const pageSelection = $derived(select(EntityType.BalancerPoolAprItem, {
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
	<title>{data?.title ?? (pageSelection.entitySelector.title || 'Balancer pool APR item')} • Balancer pool APR item • Blockhead</title>
</svelte:head>


<Page>
	<BalancerPoolAprItemView
		selection={pageSelection}
	/>
</Page>
