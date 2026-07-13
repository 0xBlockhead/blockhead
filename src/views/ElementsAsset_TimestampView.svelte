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
			selection: EntityProxyResource<typeof schema, EntityType.ElementsAsset_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.ElementsAsset_Timestamp>>
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
	const elementsAssetTimestamp = $derived(selection({
		sources: [
			Source.Esplora_Rest,
		],
		fields: {
			issuedAmount: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'Elements asset observation')
	const viewDomId = $derived('elements-asset-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import ElementsAssetView from '$/views/ElementsAssetView.svelte'
</script>


<EntityView
	entityType={EntityType.ElementsAsset_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={elementsAssetTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = pendingEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={elementsAssetTimestamp}>
			{#snippet Pending()}
				{@const issuedAmount0 = pendingEntity.issuedAmount}
				{#if issuedAmount0 !== undefined && issuedAmount0 !== null}
					<NumberValue value={Number(issuedAmount0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const issuedAmount0 = resolvedEntity.issuedAmount}
				{#if issuedAmount0 !== undefined && issuedAmount0 !== null}
					<NumberValue value={Number(issuedAmount0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Asset</dt>
				<dd>
					<ElementsAssetView
						selection={select(EntityType.ElementsAsset, selection.entitySelector.$asset, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = pendingEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = pendingEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							issuedAmount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const issuedAmount = pendingEntity.issuedAmount}
					{#if issuedAmount !== undefined && issuedAmount !== null}
						<div>
							<dt>Issued amount</dt>
							<dd>
								<NumberValue value={Number(issuedAmount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const issuedAmount = resolvedEntity.issuedAmount}
					{#if issuedAmount !== undefined && issuedAmount !== null}
						<div>
							<dt>Issued amount</dt>
							<dd>
								<NumberValue value={Number(issuedAmount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							burnedAmount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const burnedAmount = pendingEntity.burnedAmount}
					{#if burnedAmount !== undefined && burnedAmount !== null}
						<div>
							<dt>Burned amount</dt>
							<dd>
								<NumberValue value={Number(burnedAmount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const burnedAmount = resolvedEntity.burnedAmount}
					{#if burnedAmount !== undefined && burnedAmount !== null}
						<div>
							<dt>Burned amount</dt>
							<dd>
								<NumberValue value={Number(burnedAmount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							reissuanceTokenCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const reissuanceTokenCount = pendingEntity.reissuanceTokenCount}
					{#if reissuanceTokenCount !== undefined && reissuanceTokenCount !== null}
						<div>
							<dt>Reissuance tokens</dt>
							<dd>
								<NumberValue value={Number(reissuanceTokenCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const reissuanceTokenCount = resolvedEntity.reissuanceTokenCount}
					{#if reissuanceTokenCount !== undefined && reissuanceTokenCount !== null}
						<div>
							<dt>Reissuance tokens</dt>
							<dd>
								<NumberValue value={Number(reissuanceTokenCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
