<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.PendlePosition, {
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
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import PendlePositionView from '$/views/PendlePositionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'Pendle position'} • Pendle position • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Pendle position'} • Pendle position • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<PendlePositionView
		selection={pageSelection}
	/>
	{/if}
</Page>
