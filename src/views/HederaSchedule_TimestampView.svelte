<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.HederaSchedule_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.HederaSchedule_Timestamp>>
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
	const hederaScheduleTimestamp = $derived(selection({}))
	const titleFallback = $derived('hedera schedule timestamp')
	const viewDomId = $derived('hedera-schedule-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HederaScheduleView from '$/views/HederaScheduleView.svelte'
	import HederaTransactionView from '$/views/HederaTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaSchedule_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hederaScheduleTimestamp}>
			{#snippet Pending()}
				{title || 'hedera schedule timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>schedule</dt>
				<dd>
					<HederaScheduleView
						selection={select(EntityType.HederaSchedule, selection.entitySelector.$schedule)}
						layout={EntityLayout.Title}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							executedTimestamp: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const executedTimestamp = prefetched.executedTimestamp}
					{#if executedTimestamp !== undefined && executedTimestamp !== null}
						<div>
							<dt>executed timestamp</dt>
							<dd>
								{String((executedTimestamp) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const executedTimestamp = resolvedEntity.executedTimestamp}
					{#if executedTimestamp !== undefined && executedTimestamp !== null}
						<div>
							<dt>executed timestamp</dt>
							<dd>
								{String((executedTimestamp) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							deleted: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const deleted = prefetched.deleted}
					{#if deleted !== undefined && deleted !== null}
						<div>
							<dt>deleted</dt>
							<dd>
								{deleted ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const deleted = resolvedEntity.deleted}
					{#if deleted !== undefined && deleted !== null}
						<div>
							<dt>deleted</dt>
							<dd>
								{deleted ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							expirationTime: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const expirationTime = prefetched.expirationTime}
					{#if expirationTime !== undefined && expirationTime !== null}
						<div>
							<dt>expiration time</dt>
							<dd>
								{String((expirationTime) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const expirationTime = resolvedEntity.expirationTime}
					{#if expirationTime !== undefined && expirationTime !== null}
						<div>
							<dt>expiration time</dt>
							<dd>
								{String((expirationTime) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							waitForExpiry: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const waitForExpiry = prefetched.waitForExpiry}
					{#if waitForExpiry !== undefined && waitForExpiry !== null}
						<div>
							<dt>wait for expiry</dt>
							<dd>
								{waitForExpiry ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const waitForExpiry = resolvedEntity.waitForExpiry}
					{#if waitForExpiry !== undefined && waitForExpiry !== null}
						<div>
							<dt>wait for expiry</dt>
							<dd>
								{waitForExpiry ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							signatureCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const signatureCount = prefetched.signatureCount}
					{#if signatureCount !== undefined && signatureCount !== null}
						<div>
							<dt>signature count</dt>
							<dd>
								<TruncatedValue value={String((signatureCount) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const signatureCount = resolvedEntity.signatureCount}
					{#if signatureCount !== undefined && signatureCount !== null}
						<div>
							<dt>signature count</dt>
							<dd>
								<TruncatedValue value={String((signatureCount) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.HederaTransaction, false>('$executionTransaction')}
			>
				{#snippet children(hederaTransaction)}
					{#if hederaTransaction != null && hederaTransaction[EntityMetaKey.Selector] != null}
						<div>
							<dt>execution transaction</dt>
							<dd>
								<HederaTransactionView
									selection={select(EntityType.HederaTransaction, hederaTransaction[EntityMetaKey.Selector])}
									prefetched={hederaTransaction}
									layout={EntityLayout.Title}
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
