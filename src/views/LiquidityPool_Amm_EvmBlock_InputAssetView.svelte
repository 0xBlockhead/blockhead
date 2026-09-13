<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.LiquidityPool_Amm_EvmBlock_InputAsset>, 'prefetched'> = $props()

	const observation = $derived(selection.entitySelector.$observation)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.TheGraph_Graphql,
		],
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import LiquidityPool_Amm_EvmBlockView from '$/views/LiquidityPool_Amm_EvmBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.LiquidityPool_Amm_EvmBlock_InputAsset}
	entitySelector={selection.entitySelector}
	title={title ?? 'Input ' + String(selection.entitySelector.ordinal)}
	href={
		href === undefined ?
			(
				'caip2' in observation.$pool.$network ?
					resolve(
						'/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/(liquidityPool)/amm-observation/[blockSelector=stringSegment]/[sourceRevision=stringSegment]/(liquidityPoolAmmEvmBlock)/input-asset/[ordinal=nonNegativeInteger]',
						{
							chainId: observation.$pool.$network.caip2.reference,
							poolId: observation.$pool.id,
							blockSelector: String(stringify(observation.$block)),
							sourceRevision: observation.sourceRevision,
							ordinal: String(selection.entitySelector.ordinal),
						}
					)
				:
					undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<LiquidityPool_Amm_EvmBlockView
			selection={select(EntityType.LiquidityPool_Amm_EvmBlock, selection.entitySelector.$observation)}
			href={null}
			layout={EntityLayout.Value}
		/>
		{String(selection.entitySelector.ordinal)}
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Token contract</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$tokenContract}
					>
						{#snippet children(evmContract)}
							{@const evmContractInitial = untrack(() => evmContract)}
							<EvmContractView
								selection={select(EntityType.EvmContract, (evmContract ?? evmContractInitial)[EntityMetaKey.Selector])}
								prefetched={evmContract ?? evmContractInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Raw balance</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									rawBalance: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.rawBalance}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Balance (USD)</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									balanceUSD: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.balanceUSD}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Weight (%)</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									weightPercent: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.weightPercent}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
