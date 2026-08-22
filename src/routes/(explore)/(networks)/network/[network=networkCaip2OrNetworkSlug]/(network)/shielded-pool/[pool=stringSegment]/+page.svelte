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

	const pageSelection = $derived(select(EntityType.ZcashShieldedPool, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import ZcashShieldedPoolView from '$/views/ZcashShieldedPoolView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.pool || 'Zcash shielded pool')} • Zcash shielded pool • Blockhead</title>
</svelte:head>


<Page>
	<ZcashShieldedPoolView
		selection={pageSelection}
	/>
</Page>
