<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import PendlePositionView from '$/views/PendlePositionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.PendlePosition, {
				$account: {
					$network: data.selector.$network,
					$actor: {
						address: params.accountAddress,
					},
				},
				$market: data.selector,
			}, {
				sources: [
					Source.Pendle_Rest,
				],
			})}
		<title>{data?.title ?? 'Pendle position'} • Pendle position • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Pendle position'} • Pendle position • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.PendlePosition, {
				$account: {
					$network: data.selector.$network,
					$actor: {
						address: params.accountAddress,
					},
				},
				$market: data.selector,
			}, {
				sources: [
					Source.Pendle_Rest,
				],
			})}

	<PendlePositionView
		selection={pageSelection}
	/>
	{/if}
</Page>
