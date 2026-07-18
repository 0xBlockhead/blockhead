<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.AvailBlock>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.AvailBlock>>
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
	const availBlock = $derived(selection({
		sources: selection.sources,
		fields: {
			timestampMs: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.blockNumber) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.blockHash) ?? '')].filter(Boolean).join(' ') || 'avail block')
	const viewDomId = $derived('avail-block-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AvailDataSubmissionsView from '$/views/AvailDataSubmissionsView.svelte'
	import AvailNetworkView from '$/views/AvailNetworkView.svelte'
	import AvailBlockView from '$/views/AvailBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.AvailBlock}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const blockNumber0 = pendingEntity.blockNumber}
					{#if blockNumber0 !== undefined && blockNumber0 !== null}
						<NumberValue
							value={blockNumber0}
						/>
					{/if}
		{:else}
			<ResourceBoundary resource={availBlock}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockNumber0 = resolvedEntity.blockNumber}
					{#if blockNumber0 !== undefined && blockNumber0 !== null}
						<NumberValue
							value={blockNumber0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const timestampMs0 = pendingEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
		{:else}
			<ResourceBoundary resource={availBlock}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs0 = resolvedEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<AvailNetworkView
						selection={select(EntityType.AvailNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Block number</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									blockNumber: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const blockNumber = resolvedEntity.blockNumber}
							{#if blockNumber !== undefined && blockNumber !== null}
								<NumberValue
									value={blockNumber}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Block hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									blockHash: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const blockHash = resolvedEntity.blockHash}
							{#if blockHash !== undefined && blockHash !== null}
								<TruncatedValue value={String((blockHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							parentHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const parentHash = resolvedEntity.parentHash}
					{#if parentHash !== undefined && parentHash !== null}
						<div>
							<dt>parent hash</dt>
							<dd>
								<TruncatedValue value={String((parentHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$parent}
			>
				{#snippet children(availBlock)}
					{#if availBlock != null && availBlock[EntityMetaKey.Selector] != null}
						<div>
							<dt>parent</dt>
							<dd>
								<AvailBlockView
									selection={select(EntityType.AvailBlock, availBlock[EntityMetaKey.Selector])}
									prefetched={availBlock}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							timestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs = resolvedEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							stateRoot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stateRoot = resolvedEntity.stateRoot}
					{#if stateRoot !== undefined && stateRoot !== null}
						<div>
							<dt>state root</dt>
							<dd>
								{String((stateRoot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							extrinsicsRoot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const extrinsicsRoot = resolvedEntity.extrinsicsRoot}
					{#if extrinsicsRoot !== undefined && extrinsicsRoot !== null}
						<div>
							<dt>extrinsics root</dt>
							<dd>
								{String((extrinsicsRoot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							extrinsicCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const extrinsicCount = resolvedEntity.extrinsicCount}
					{#if extrinsicCount !== undefined && extrinsicCount !== null}
						<div>
							<dt>extrinsic count</dt>
							<dd>
								<NumberValue
									value={extrinsicCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							dataSubmissionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const dataSubmissionCount = resolvedEntity.dataSubmissionCount}
					{#if dataSubmissionCount !== undefined && dataSubmissionCount !== null}
						<div>
							<dt>data submission count</dt>
							<dd>
								<NumberValue
									value={dataSubmissionCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							appIdCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const appIdCount = resolvedEntity.appIdCount}
					{#if appIdCount !== undefined && appIdCount !== null}
						<div>
							<dt>app ID count</dt>
							<dd>
								<NumberValue
									value={appIdCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<AvailDataSubmissionsView
				selection={
						selection.$$dataSubmissions({
							count: true,
						})
					}
				title='data submissions'
				emptyText='No data submissions found.'
				id='AvailDataSubmissionsView-data-submissions'
			/>
		{/if}
	{/snippet}
</EntityView>
