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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadZcashViewingKey_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadZcashViewingKey_Timestamp>>
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
	const blockheadZcashViewingKeyTimestamp = $derived(selection({
		sources: [
			Source.Local_Internal,
			Source.ZcashClientBackend_Local,
			Source.ZcashLightwalletd_Grpc,
			Source.ZcashdWallet_JsonRpc,
		],
		fields: {
			lastScannedHeight: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead zcash viewing key timestamp')
	const viewDomId = $derived('blockhead-zcash-viewing-key-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadZcashViewingKeyView from '$/views/BlockheadZcashViewingKeyView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadZcashViewingKey_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadZcashViewingKeyTimestamp}>
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
		<ResourceBoundary resource={blockheadZcashViewingKeyTimestamp}>
			{#snippet Pending()}
				{@const lastScannedHeight0 = pendingEntity.lastScannedHeight}
				{#if lastScannedHeight0 !== undefined && lastScannedHeight0 !== null}
					<NumberValue value={Number(lastScannedHeight0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const lastScannedHeight0 = resolvedEntity.lastScannedHeight}
				{#if lastScannedHeight0 !== undefined && lastScannedHeight0 !== null}
					<NumberValue value={Number(lastScannedHeight0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadZcashViewingKeyTimestamp}>
			{#snippet Pending()}
				{@const source0 = pendingEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const source0 = resolvedEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>viewing key</dt>
				<dd>
					<BlockheadZcashViewingKeyView
						selection={select(EntityType.BlockheadZcashViewingKey, selection.entitySelector.$viewingKey, {})}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastScannedHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lastScannedHeight = pendingEntity.lastScannedHeight}
					{#if lastScannedHeight !== undefined && lastScannedHeight !== null}
						<div>
							<dt>last scanned height</dt>
							<dd>
								<NumberValue value={Number(lastScannedHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastScannedHeight = resolvedEntity.lastScannedHeight}
					{#if lastScannedHeight !== undefined && lastScannedHeight !== null}
						<div>
							<dt>last scanned height</dt>
							<dd>
								<NumberValue value={Number(lastScannedHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastScannedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lastScannedAt = pendingEntity.lastScannedAt}
					{#if lastScannedAt !== undefined && lastScannedAt !== null}
						<div>
							<dt>last scanned AT</dt>
							<dd>
								<Timestamp timestamp={Number(lastScannedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastScannedAt = resolvedEntity.lastScannedAt}
					{#if lastScannedAt !== undefined && lastScannedAt !== null}
						<div>
							<dt>last scanned AT</dt>
							<dd>
								<Timestamp timestamp={Number(lastScannedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							notesDiscovered: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const notesDiscovered = pendingEntity.notesDiscovered}
					{#if notesDiscovered !== undefined && notesDiscovered !== null}
						<div>
							<dt>notes discovered</dt>
							<dd>
								<NumberValue value={Number(notesDiscovered)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const notesDiscovered = resolvedEntity.notesDiscovered}
					{#if notesDiscovered !== undefined && notesDiscovered !== null}
						<div>
							<dt>notes discovered</dt>
							<dd>
								<NumberValue value={Number(notesDiscovered)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nullifiersMatched: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nullifiersMatched = pendingEntity.nullifiersMatched}
					{#if nullifiersMatched !== undefined && nullifiersMatched !== null}
						<div>
							<dt>nullifiers matched</dt>
							<dd>
								<NumberValue value={Number(nullifiersMatched)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nullifiersMatched = resolvedEntity.nullifiersMatched}
					{#if nullifiersMatched !== undefined && nullifiersMatched !== null}
						<div>
							<dt>nullifiers matched</dt>
							<dd>
								<NumberValue value={Number(nullifiersMatched)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
