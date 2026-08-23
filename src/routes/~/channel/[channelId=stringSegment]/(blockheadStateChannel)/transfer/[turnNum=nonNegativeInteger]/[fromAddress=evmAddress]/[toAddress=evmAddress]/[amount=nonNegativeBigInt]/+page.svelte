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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadStateChannelTransfer, {
		$channel: data.selector,
		turnNum: Number(params.turnNum),
		$from: {
			address: params.fromAddress,
		},
		$to: {
			address: params.toAddress,
		},
		amount: BigInt(params.amount),
	}, {
		sources: [
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadStateChannelTransferView from '$/views/BlockheadStateChannelTransferView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.amount) || 'blockhead state channel transfer')} • blockhead state channel transfer • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead state channel transfer'} • blockhead state channel transfer • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadStateChannelTransferView
		selection={pageSelection}
	/>
	{/if}
</Page>
