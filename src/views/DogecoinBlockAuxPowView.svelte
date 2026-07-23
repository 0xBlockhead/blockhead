<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.DogecoinBlockAuxPow>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.DogecoinBlockAuxPow>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const dogecoinBlockAuxPow = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = 'dogecoin block aux pow'
	const viewDomId = $derived('dogecoin-block-aux-pow-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
	import DogecoinAuxPowParentBlockHeaderView from '$/views/DogecoinAuxPowParentBlockHeaderView.svelte'
	import DogecoinAuxPowMerkleBranchView from '$/views/DogecoinAuxPowMerkleBranchView.svelte'
</script>


<EntityView
	entityType={EntityType.DogecoinBlockAuxPow}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={dogecoinBlockAuxPow}>
			{#snippet children(entity)}
				<UtxoBlockView
					selection={select(EntityType.UtxoBlock, selection.entitySelector.$block)}
					href=""
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={dogecoinBlockAuxPow}>
			{#snippet children(entity)}
				<ResourceBoundary
					resource={selection.$parentBlockHeader}
				>
					{#snippet children(dogecoinAuxPowParentBlockHeader)}
						{#if dogecoinAuxPowParentBlockHeader != null && dogecoinAuxPowParentBlockHeader[EntityMetaKey.Selector] != null}
							<DogecoinAuxPowParentBlockHeaderView
								selection={select(EntityType.DogecoinAuxPowParentBlockHeader, dogecoinAuxPowParentBlockHeader[EntityMetaKey.Selector])}
								prefetched={dogecoinAuxPowParentBlockHeader}
								href=""
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Block</dt>
				<dd>
					<UtxoBlockView
						selection={select(EntityType.UtxoBlock, selection.entitySelector.$block)}
						href={
							(
								selection.entitySelector.$block != null && 'height' in selection.entitySelector.$block
								&& selection.entitySelector.$block.height != null
								&& selection.entitySelector.$block != null && 'hash' in selection.entitySelector.$block
								&& selection.entitySelector.$block.hash != null
								&& selection.entitySelector.$block != null && '$network' in selection.entitySelector.$block ?
									selection.entitySelector.$block.$network != null && 'caip2' in selection.entitySelector.$block.$network
									&& selection.entitySelector.$block.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
									blockNumber: String(selection.entitySelector.$block.height ?? ''),
									hash: String(selection.entitySelector.$block.hash ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$block.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$block.$network != null && 'slug' in selection.entitySelector.$block.$network
										&& selection.entitySelector.$block.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
										blockNumber: String(selection.entitySelector.$block.height ?? ''),
										hash: String(selection.entitySelector.$block.hash ?? ''),
										network: String(selection.entitySelector.$block.$network.slug ?? ''),
									})
									:
										undefined
							:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$parentBlockHeader}
			>
				{#snippet children(dogecoinAuxPowParentBlockHeader)}
					{#if dogecoinAuxPowParentBlockHeader != null && dogecoinAuxPowParentBlockHeader[EntityMetaKey.Selector] != null}
						<div>
							<dt>Parent block header</dt>
							<dd>
								<DogecoinAuxPowParentBlockHeaderView
									selection={select(EntityType.DogecoinAuxPowParentBlockHeader, dogecoinAuxPowParentBlockHeader[EntityMetaKey.Selector])}
									prefetched={dogecoinAuxPowParentBlockHeader}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$coinbaseBranch}
			>
				{#snippet children(dogecoinAuxPowMerkleBranch)}
					{#if dogecoinAuxPowMerkleBranch != null && dogecoinAuxPowMerkleBranch[EntityMetaKey.Selector] != null}
						<div>
							<dt>Coinbase branch</dt>
							<dd>
								<DogecoinAuxPowMerkleBranchView
									selection={select(EntityType.DogecoinAuxPowMerkleBranch, dogecoinAuxPowMerkleBranch[EntityMetaKey.Selector])}
									prefetched={dogecoinAuxPowMerkleBranch}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$chainBranch}
			>
				{#snippet children(dogecoinAuxPowMerkleBranch)}
					{#if dogecoinAuxPowMerkleBranch != null && dogecoinAuxPowMerkleBranch[EntityMetaKey.Selector] != null}
						<div>
							<dt>Chain branch</dt>
							<dd>
								<DogecoinAuxPowMerkleBranchView
									selection={select(EntityType.DogecoinAuxPowMerkleBranch, dogecoinAuxPowMerkleBranch[EntityMetaKey.Selector])}
									prefetched={dogecoinAuxPowMerkleBranch}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
