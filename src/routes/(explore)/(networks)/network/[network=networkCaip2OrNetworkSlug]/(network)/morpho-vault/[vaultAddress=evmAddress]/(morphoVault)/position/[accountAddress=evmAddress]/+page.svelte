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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.MorphoVaultPosition, {
		$account: {
			$network: data.selector.$network,
			$actor: {
				address: params.accountAddress,
			},
		},
		$vault: data.selector,
	}, {
		sources: [
			Source.Morpho_Graphql,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import MorphoVaultPositionView from '$/views/MorphoVaultPositionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'Morpho vault position'} • Morpho vault position • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Morpho vault position'} • Morpho vault position • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<MorphoVaultPositionView
		selection={pageSelection}
	/>
	{/if}
</Page>
