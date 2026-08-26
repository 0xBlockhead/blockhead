<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
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
	}: Omit<EntitySelectionViewProps<EntityType.DogecoinAuxPowMerkleBranch>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.DogecoinCore_JsonRpc,
		],
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import DogecoinBlockAuxPowView from '$/views/DogecoinBlockAuxPowView.svelte'
</script>


<EntityView
	entityType={EntityType.DogecoinAuxPowMerkleBranch}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.branchKind || 'dogecoin aux pow merkle branch')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/aux-pow/(dogecoinBlockAuxPow)/branch/[branchKind=stringSegment]',
				{
					network: (
						'caip2' in selection.entitySelector.$auxPow.$block.$network ?
							caip2StringFromValue(selection.entitySelector.$auxPow.$block.$network.caip2)
						:
							selection.entitySelector.$auxPow.$block.$network.slug
					),
					blockNumber: String(selection.entitySelector.$auxPow.$block.height),
					branchKind: selection.entitySelector.branchKind,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<DogecoinBlockAuxPowView
			selection={select(EntityType.DogecoinBlockAuxPow, selection.entitySelector.$auxPow)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>AuxPoW</dt>
				<dd>
					<DogecoinBlockAuxPowView
						selection={select(EntityType.DogecoinBlockAuxPow, selection.entitySelector.$auxPow)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Branch kind</dt>
				<dd>
					{selection.entitySelector.branchKind}
				</dd>
			</div>

			<div>
				<dt>Branch hashes</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									branchHashes: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.branchHashes.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							index: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const index = entity.index}
					{#if index != null}
						<div>
							<dt>Index</dt>
							<dd>
								<NumberValue
									value={index}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
