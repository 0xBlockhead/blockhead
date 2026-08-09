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

	const pageSelection = $derived(select(EntityType.PolkadotValidator_Era, {
		$validator: data.selector,
		eraIndex: BigInt(params.eraIndex),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotValidator_EraView from '$/views/PolkadotValidator_EraView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.eraIndex) || 'polkadot validator era')} • polkadot validator era • Blockhead</title>
</svelte:head>


<Page>
	<PolkadotValidator_EraView
		selection={pageSelection}
	/>
</Page>
