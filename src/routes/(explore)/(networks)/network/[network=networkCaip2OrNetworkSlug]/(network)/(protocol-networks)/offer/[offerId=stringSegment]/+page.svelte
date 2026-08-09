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


	// Components
	import Page from '$/components/Page.svelte'
	import StellarOfferView from '$/views/StellarOfferView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'stellar offer'} • stellar offer • Blockhead</title>
</svelte:head>


<Page>
	<StellarOfferView
		selection={select(EntityType.StellarOffer, data.selector)}
	/>
</Page>
