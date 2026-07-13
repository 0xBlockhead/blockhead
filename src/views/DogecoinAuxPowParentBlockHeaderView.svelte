<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.DogecoinAuxPowParentBlockHeader>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.DogecoinAuxPowParentBlockHeader>>
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
	const dogecoinAuxPowParentBlockHeader = $derived(selection({
		sources: [
			Source.DogecoinCore_JsonRpc,
		],
		fields: {
			merkleRoot: true,
		},
	}))
	const titleFallback = $derived('dogecoin aux pow parent block header')
	const viewDomId = $derived('dogecoin-aux-pow-parent-block-header-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import DogecoinBlockAuxPowView from '$/views/DogecoinBlockAuxPowView.svelte'
</script>


<EntityView
	entityType={EntityType.DogecoinAuxPowParentBlockHeader}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={dogecoinAuxPowParentBlockHeader}>
			{#snippet Pending()}
				<DogecoinBlockAuxPowView
					selection={select(EntityType.DogecoinBlockAuxPow, selection.entitySelector.$auxPow)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<DogecoinBlockAuxPowView
					selection={select(EntityType.DogecoinBlockAuxPow, selection.entitySelector.$auxPow)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={dogecoinAuxPowParentBlockHeader}>
			{#snippet Pending()}
				{[String((pendingEntity.merkleRoot) ?? '')].filter(Boolean).join(' ') || title || 'dogecoin aux pow parent block header'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.merkleRoot) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>AuxPoW</dt>
				<dd>
					<DogecoinBlockAuxPowView
						selection={select(EntityType.DogecoinBlockAuxPow, selection.entitySelector.$auxPow, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							hash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const hash = pendingEntity.hash}
					{#if hash !== undefined && hash !== null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue value={String((hash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const hash = resolvedEntity.hash}
					{#if hash !== undefined && hash !== null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue value={String((hash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							merkleRoot: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const merkleRoot = pendingEntity.merkleRoot}
					{#if merkleRoot !== undefined && merkleRoot !== null}
						<div>
							<dt>Merkle root</dt>
							<dd>
								{String((merkleRoot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const merkleRoot = resolvedEntity.merkleRoot}
					{#if merkleRoot !== undefined && merkleRoot !== null}
						<div>
							<dt>Merkle root</dt>
							<dd>
								{String((merkleRoot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nonce: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nonce = pendingEntity.nonce}
					{#if nonce !== undefined && nonce !== null}
						<div>
							<dt>Nonce</dt>
							<dd>
								<NumberValue value={Number(nonce)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nonce = resolvedEntity.nonce}
					{#if nonce !== undefined && nonce !== null}
						<div>
							<dt>Nonce</dt>
							<dd>
								<NumberValue value={Number(nonce)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
