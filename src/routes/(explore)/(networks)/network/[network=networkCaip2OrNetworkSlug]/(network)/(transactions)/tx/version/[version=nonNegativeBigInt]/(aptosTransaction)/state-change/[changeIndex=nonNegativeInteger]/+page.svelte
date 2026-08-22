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

	const pageSelection = $derived(select(EntityType.AptosStateChange, {
		$transaction: data.selector,
		changeIndex: Number(params.changeIndex),
	}, {
		fields: {
			changeKind: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AptosStateChangeView from '$/views/AptosStateChangeView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'aptos state change' : pageSelection.entity.changeKind || 'aptos state change')} • aptos state change • Blockhead</title>
</svelte:head>


<Page>
	<AptosStateChangeView
		selection={pageSelection}
	/>
</Page>
