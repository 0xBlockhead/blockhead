<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.DogecoinAuxPowParentBlockHeader>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.DogecoinCore_JsonRpc,
		],
	}))
	const dogecoinAuxPowParentBlockHeader = $derived(viewSelection({
		fields: {
			merkleRoot: true,
		},
	}))
	const titleFallback = 'dogecoin aux pow parent block header'


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import DogecoinBlockAuxPowView from '$/views/DogecoinBlockAuxPowView.svelte'
</script>


<EntityView
	entityType={EntityType.DogecoinAuxPowParentBlockHeader}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/aux-pow/(dogecoinBlockAuxPow)/parent-block-header',
				{
					network: (
						'caip2' in selection.entitySelector.$auxPow.$block.$network ?
							caip2StringFromValue(selection.entitySelector.$auxPow.$block.$network.caip2)
						:
							selection.entitySelector.$auxPow.$block.$network.slug
					),
					blockNumber: String(selection.entitySelector.$auxPow.$block.height),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<DogecoinBlockAuxPowView
			selection={select(EntityType.DogecoinBlockAuxPow, selection.entitySelector.$auxPow)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={dogecoinAuxPowParentBlockHeader}>
			{#snippet children(entity)}
				{(entity.merkleRoot ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
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

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							hash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const hash = entity.hash}
					{#if hash != null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue value={hash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={dogecoinAuxPowParentBlockHeader}
			>
				{#snippet children(entity)}
					{@const merkleRoot = entity.merkleRoot}
					{#if merkleRoot != null}
						<div>
							<dt>Merkle root</dt>
							<dd>
								{merkleRoot}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							nonce: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nonce = entity.nonce}
					{#if nonce != null}
						<div>
							<dt>Nonce</dt>
							<dd>
								<NumberValue
									value={nonce}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
