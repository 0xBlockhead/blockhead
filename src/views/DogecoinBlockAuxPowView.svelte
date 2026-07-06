<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { networkByCaip2 } from '$/constants/Network.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.DogecoinBlockAuxPow>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.DogecoinBlockAuxPow>>
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
	const dogecoinBlockAuxPow = $derived(selection({
		sources: [
			Source.DogecoinCore_JsonRpc,
		],
		fields: {
			$parentBlockHeader: true,
		},
	}))
	const titleFallback = $derived('dogecoin block aux pow')
	const viewDomId = $derived('dogecoin-block-aux-pow-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
			{#snippet Pending()}
				<UtxoBlockView
					selection={select(EntityType.UtxoBlock, selection.entitySelector.$block)}
					href={
						(selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.caip2 !== undefined && selection.entitySelector.$block.$network.caip2.namespace !== undefined && selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.caip2 !== undefined && selection.entitySelector.$block.$network.caip2.reference !== undefined && selection.entitySelector.$block.height !== undefined && selection.entitySelector.$block.hash !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/block/[height=nonNegativeInteger]/[hash]', {
							networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$block.$network.caip2.namespace) + ':' + String(selection.entitySelector.$block.$network.caip2.reference))].slug ?? ''),
							height: String(selection.entitySelector.$block.height ?? ''),
							hash: String(selection.entitySelector.$block.hash ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<UtxoBlockView
					selection={select(EntityType.UtxoBlock, selection.entitySelector.$block)}
					href={
						(selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.caip2 !== undefined && selection.entitySelector.$block.$network.caip2.namespace !== undefined && selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.caip2 !== undefined && selection.entitySelector.$block.$network.caip2.reference !== undefined && selection.entitySelector.$block.height !== undefined && selection.entitySelector.$block.hash !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/block/[height=nonNegativeInteger]/[hash]', {
							networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$block.$network.caip2.namespace) + ':' + String(selection.entitySelector.$block.$network.caip2.reference))].slug ?? ''),
							height: String(selection.entitySelector.$block.height ?? ''),
							hash: String(selection.entitySelector.$block.hash ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={dogecoinBlockAuxPow}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.DogecoinAuxPowParentBlockHeader, false>('$parentBlockHeader')}
				>
					{#snippet children(dogecoinAuxPowParentBlockHeader)}
						{#if dogecoinAuxPowParentBlockHeader != null && dogecoinAuxPowParentBlockHeader[EntityMetaKey.Selector] != null}
							<DogecoinAuxPowParentBlockHeaderView
								selection={select(EntityType.DogecoinAuxPowParentBlockHeader, dogecoinAuxPowParentBlockHeader[EntityMetaKey.Selector])}
								prefetched={dogecoinAuxPowParentBlockHeader}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.DogecoinAuxPowParentBlockHeader, false>('$parentBlockHeader')}
				>
					{#snippet children(dogecoinAuxPowParentBlockHeader)}
						{#if dogecoinAuxPowParentBlockHeader != null && dogecoinAuxPowParentBlockHeader[EntityMetaKey.Selector] != null}
							<DogecoinAuxPowParentBlockHeaderView
								selection={select(EntityType.DogecoinAuxPowParentBlockHeader, dogecoinAuxPowParentBlockHeader[EntityMetaKey.Selector])}
								prefetched={dogecoinAuxPowParentBlockHeader}
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
							(selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.caip2 !== undefined && selection.entitySelector.$block.$network.caip2.namespace !== undefined && selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.caip2 !== undefined && selection.entitySelector.$block.$network.caip2.reference !== undefined && selection.entitySelector.$block.height !== undefined && selection.entitySelector.$block.hash !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/block/[height=nonNegativeInteger]/[hash]', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$block.$network.caip2.namespace) + ':' + String(selection.entitySelector.$block.$network.caip2.reference))].slug ?? ''),
								height: String(selection.entitySelector.$block.height ?? ''),
								hash: String(selection.entitySelector.$block.hash ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.DogecoinAuxPowParentBlockHeader, false>('$parentBlockHeader')}
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
				resource={selection[EntityProxyField]<EntityType.DogecoinAuxPowMerkleBranch, false>('$coinbaseBranch')}
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
				resource={selection[EntityProxyField]<EntityType.DogecoinAuxPowMerkleBranch, false>('$chainBranch')}
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
