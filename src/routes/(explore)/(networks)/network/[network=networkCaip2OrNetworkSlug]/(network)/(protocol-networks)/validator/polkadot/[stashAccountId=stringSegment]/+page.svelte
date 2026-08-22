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

	const pageSelection = $derived(select(EntityType.PolkadotValidator, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotValidatorView from '$/views/PolkadotValidatorView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.stashAccountId || 'Polkadot validator')} • Polkadot validator • Blockhead</title>
</svelte:head>


<Page>
	<PolkadotValidatorView
		selection={pageSelection}
	/>
</Page>
