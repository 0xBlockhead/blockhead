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

	const pageSelection = $derived(select(EntityType.BnbValidator, data.selector, {
		fields: {
			moniker: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BnbValidatorView from '$/views/BnbValidatorView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.operatorAddress ?? '') || 'bnb validator' : (pageSelection.entity.moniker ?? '') || pageSelection.entitySelector.operatorAddress || 'bnb validator')} • bnb validator • Blockhead</title>
</svelte:head>


<Page>
	<BnbValidatorView
		selection={pageSelection}
	/>
</Page>
