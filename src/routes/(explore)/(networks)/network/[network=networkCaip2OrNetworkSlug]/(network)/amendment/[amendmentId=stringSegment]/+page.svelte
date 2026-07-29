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

	const pageSelection = $derived(select(EntityType.XrplAmendment, data.selector, {
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import XrplAmendmentView from '$/views/XrplAmendmentView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'XRPL amendment'} • XRPL amendment • Blockhead</title>
</svelte:head>


<Page>
	<XrplAmendmentView
		selection={pageSelection}
	/>
</Page>
