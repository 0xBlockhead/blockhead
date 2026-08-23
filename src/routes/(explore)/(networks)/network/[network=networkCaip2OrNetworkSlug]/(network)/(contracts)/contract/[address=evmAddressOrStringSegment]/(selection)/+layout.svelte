<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()

	const detailHref = $derived(
		resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]',
			{
				network: params.network,
				address: params.address,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import CosmosContractView from '$/views/CosmosContractView.svelte'
	import HederaContractView from '$/views/HederaContractView.svelte'
	import NearContractView from '$/views/NearContractView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if data?.selector != null}
			{@const DetailView = data.entityType === EntityType.EvmContract ? EvmContractView : data.entityType === EntityType.CosmosContract ? CosmosContractView : data.entityType === EntityType.HederaContract ? HederaContractView : NearContractView}

			<DetailView
				selection={select(data.entityType, data.selector)}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
