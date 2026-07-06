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
			selection: EntityProxyResource<typeof schema, EntityType.DogecoinAuxPowMerkleBranch>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.DogecoinAuxPowMerkleBranch>>
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
	const dogecoinAuxPowMerkleBranch = $derived(selection({
		sources: [
			Source.DogecoinCore_JsonRpc,
		],
	}))
	const titleFallback = $derived([String((selection.entitySelector.branchKind ?? prefetched.branchKind) ?? '')].filter(Boolean).join(' ') || 'dogecoin aux pow merkle branch')
	const viewDomId = $derived('dogecoin-aux-pow-merkle-branch-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import DogecoinBlockAuxPowView from '$/views/DogecoinBlockAuxPowView.svelte'
</script>


<EntityView
	entityType={EntityType.DogecoinAuxPowMerkleBranch}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={dogecoinAuxPowMerkleBranch}>
			{#snippet Pending()}
				{[String((selection.entitySelector.branchKind ?? prefetched.branchKind) ?? '')].filter(Boolean).join(' ') || title || 'dogecoin aux pow merkle branch'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.branchKind) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={dogecoinAuxPowMerkleBranch}>
			{#snippet Pending()}
				<DogecoinBlockAuxPowView
					selection={select(EntityType.DogecoinBlockAuxPow, selection.entitySelector.$auxPow)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<DogecoinBlockAuxPowView
					selection={select(EntityType.DogecoinBlockAuxPow, selection.entitySelector.$auxPow)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>AuxPoW</dt>
				<dd>
					<DogecoinBlockAuxPowView
						selection={select(EntityType.DogecoinBlockAuxPow, selection.entitySelector.$auxPow)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Branch kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									branchKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const branchKind = selection.entitySelector.branchKind ?? prefetched.branchKind}
							{#if branchKind !== undefined && branchKind !== null}
								{String((branchKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const branchKind = resolvedEntity.branchKind}
							{#if branchKind !== undefined && branchKind !== null}
								{String((branchKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Branch hashes</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									branchHashes: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const branchHashes = prefetched.branchHashes}
							{#if branchHashes !== undefined && branchHashes !== null}
								<TruncatedValue value={(branchHashes?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const branchHashes = resolvedEntity.branchHashes}
							{#if branchHashes !== undefined && branchHashes !== null}
								<TruncatedValue value={(branchHashes?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							index: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const index = prefetched.index}
					{#if index !== undefined && index !== null}
						<div>
							<dt>Index</dt>
							<dd>
								<NumberValue value={Number(index)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const index = resolvedEntity.index}
					{#if index !== undefined && index !== null}
						<div>
							<dt>Index</dt>
							<dd>
								<NumberValue value={Number(index)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
