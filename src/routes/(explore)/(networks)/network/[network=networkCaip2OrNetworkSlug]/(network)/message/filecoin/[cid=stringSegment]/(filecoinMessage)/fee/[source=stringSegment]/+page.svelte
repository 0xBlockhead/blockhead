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


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinMessageFeeView from '$/views/FilecoinMessageFeeView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.FilecoinMessageFee, {
				$message: data.selector,
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.source || 'filecoin message fee')} • filecoin message fee • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'filecoin message fee'} • filecoin message fee • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.FilecoinMessageFee, {
				$message: data.selector,
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<FilecoinMessageFeeView
		selection={pageSelection}
	/>
	{/if}
</Page>
