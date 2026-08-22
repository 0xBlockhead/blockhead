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
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.PolkadotReferendum, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotReferendumView from '$/views/PolkadotReferendumView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.referendumId || 'Polkadot referendum')} • Polkadot referendum • Blockhead</title>
</svelte:head>


<Page>
	<PolkadotReferendumView
		selection={pageSelection}
	/>
</Page>
