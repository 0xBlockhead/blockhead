<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pageSelection = $derived(select(EntityType.XrplTrustline, data.selector, {
		fields: {
			$account: true,
			$issuerAccount: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import XrplTrustlineView from '$/views/XrplTrustlineView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? ('XRPL trustline'))} • XRPL trustline • Blockhead</title>
</svelte:head>


<Page>
	<XrplTrustlineView
		selection={pageSelection}
	/>
</Page>
