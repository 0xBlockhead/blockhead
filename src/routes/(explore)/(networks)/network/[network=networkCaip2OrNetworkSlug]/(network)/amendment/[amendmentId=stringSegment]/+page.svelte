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
	import XrplAmendmentView from '$/views/XrplAmendmentView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.XrplAmendment, data.selector)}
		<title>{data?.title ?? 'XRPL amendment'} • XRPL amendment • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'XRPL amendment'} • XRPL amendment • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.XrplAmendment, data.selector)}

	<XrplAmendmentView
		selection={pageSelection}
	/>
	{/if}
</Page>
