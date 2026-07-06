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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalEvmAbiCatalog_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType._GlobalEvmAbiCatalog_Timestamp>>
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
	const globalEvmAbiCatalogTimestamp = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
	}))
	const titleFallback = $derived('global EVM ABI catalog timestamp')
	const viewDomId = $derived('-global-evm-abi-catalog-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import GlobalEvmAbiCatalogView from '$/views/_GlobalEvmAbiCatalogView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalEvmAbiCatalog_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={globalEvmAbiCatalogTimestamp}>
			{#snippet Pending()}
				<GlobalEvmAbiCatalogView
					selection={select(EntityType._GlobalEvmAbiCatalog, selection.entitySelector.$hub)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<GlobalEvmAbiCatalogView
					selection={select(EntityType._GlobalEvmAbiCatalog, selection.entitySelector.$hub)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={globalEvmAbiCatalogTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
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

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>hub</dt>
				<dd>
					<GlobalEvmAbiCatalogView
						selection={select(EntityType._GlobalEvmAbiCatalog, selection.entitySelector.$hub)}
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
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
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
							{@const source = selection.entitySelector.source ?? prefetched.source}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceReportedSelectorCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceReportedSelectorCount = prefetched.sourceReportedSelectorCount}
					{#if sourceReportedSelectorCount !== undefined && sourceReportedSelectorCount !== null}
						<div>
							<dt>source reported selector count</dt>
							<dd>
								<NumberValue value={Number(sourceReportedSelectorCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceReportedSelectorCount = resolvedEntity.sourceReportedSelectorCount}
					{#if sourceReportedSelectorCount !== undefined && sourceReportedSelectorCount !== null}
						<div>
							<dt>source reported selector count</dt>
							<dd>
								<NumberValue value={Number(sourceReportedSelectorCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceReportedTopicCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceReportedTopicCount = prefetched.sourceReportedTopicCount}
					{#if sourceReportedTopicCount !== undefined && sourceReportedTopicCount !== null}
						<div>
							<dt>source reported topic count</dt>
							<dd>
								<NumberValue value={Number(sourceReportedTopicCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceReportedTopicCount = resolvedEntity.sourceReportedTopicCount}
					{#if sourceReportedTopicCount !== undefined && sourceReportedTopicCount !== null}
						<div>
							<dt>source reported topic count</dt>
							<dd>
								<NumberValue value={Number(sourceReportedTopicCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceReportedErrorCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceReportedErrorCount = prefetched.sourceReportedErrorCount}
					{#if sourceReportedErrorCount !== undefined && sourceReportedErrorCount !== null}
						<div>
							<dt>source reported error count</dt>
							<dd>
								<NumberValue value={Number(sourceReportedErrorCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceReportedErrorCount = resolvedEntity.sourceReportedErrorCount}
					{#if sourceReportedErrorCount !== undefined && sourceReportedErrorCount !== null}
						<div>
							<dt>source reported error count</dt>
							<dd>
								<NumberValue value={Number(sourceReportedErrorCount)} />
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
						fields: {
							seededSelectorCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const seededSelectorCount = prefetched.seededSelectorCount}
					{#if seededSelectorCount !== undefined && seededSelectorCount !== null}
						<div>
							<dt>seeded selector count</dt>
							<dd>
								<NumberValue value={Number(seededSelectorCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const seededSelectorCount = resolvedEntity.seededSelectorCount}
					{#if seededSelectorCount !== undefined && seededSelectorCount !== null}
						<div>
							<dt>seeded selector count</dt>
							<dd>
								<NumberValue value={Number(seededSelectorCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							seededTopicCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const seededTopicCount = prefetched.seededTopicCount}
					{#if seededTopicCount !== undefined && seededTopicCount !== null}
						<div>
							<dt>seeded topic count</dt>
							<dd>
								<NumberValue value={Number(seededTopicCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const seededTopicCount = resolvedEntity.seededTopicCount}
					{#if seededTopicCount !== undefined && seededTopicCount !== null}
						<div>
							<dt>seeded topic count</dt>
							<dd>
								<NumberValue value={Number(seededTopicCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							seededErrorCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const seededErrorCount = prefetched.seededErrorCount}
					{#if seededErrorCount !== undefined && seededErrorCount !== null}
						<div>
							<dt>seeded error count</dt>
							<dd>
								<NumberValue value={Number(seededErrorCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const seededErrorCount = resolvedEntity.seededErrorCount}
					{#if seededErrorCount !== undefined && seededErrorCount !== null}
						<div>
							<dt>seeded error count</dt>
							<dd>
								<NumberValue value={Number(seededErrorCount)} />
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
						fields: {
							reachable: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const reachable = prefetched.reachable}
					{#if reachable !== undefined && reachable !== null}
						<div>
							<dt>reachable</dt>
							<dd>
								{reachable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const reachable = resolvedEntity.reachable}
					{#if reachable !== undefined && reachable !== null}
						<div>
							<dt>reachable</dt>
							<dd>
								{reachable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rateLimitRemaining: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const rateLimitRemaining = prefetched.rateLimitRemaining}
					{#if rateLimitRemaining !== undefined && rateLimitRemaining !== null}
						<div>
							<dt>rate limit remaining</dt>
							<dd>
								<NumberValue value={Number(rateLimitRemaining)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rateLimitRemaining = resolvedEntity.rateLimitRemaining}
					{#if rateLimitRemaining !== undefined && rateLimitRemaining !== null}
						<div>
							<dt>rate limit remaining</dt>
							<dd>
								<NumberValue value={Number(rateLimitRemaining)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
