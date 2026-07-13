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
			selection: EntityProxyResource<typeof schema, EntityType.XrplAccount_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.XrplAccount_Timestamp>>
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
	const xrplAccountTimestamp = $derived(selection({}))
	const titleFallback = $derived('XRPL account timestamp')
	const viewDomId = $derived('xrpl-account-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import XrplAccountView from '$/views/XrplAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.XrplAccount_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={xrplAccountTimestamp}>
			{#snippet Pending()}
				{title || 'XRPL account timestamp'}
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
				<dt>account</dt>
				<dd>
					<XrplAccountView
						selection={select(EntityType.XrplAccount, selection.entitySelector.$account, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>ledger index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									ledgerIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const ledgerIndex = pendingEntity.ledgerIndex}
							{#if ledgerIndex !== undefined && ledgerIndex !== null}
								{String((ledgerIndex) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const ledgerIndex = resolvedEntity.ledgerIndex}
							{#if ledgerIndex !== undefined && ledgerIndex !== null}
								{String((ledgerIndex) ?? '')}
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
							timestampMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const timestampMs = pendingEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							balanceDrops: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const balanceDrops = pendingEntity.balanceDrops}
					{#if balanceDrops !== undefined && balanceDrops !== null}
						<div>
							<dt>balance drops</dt>
							<dd>
								{String((balanceDrops) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const balanceDrops = resolvedEntity.balanceDrops}
					{#if balanceDrops !== undefined && balanceDrops !== null}
						<div>
							<dt>balance drops</dt>
							<dd>
								{String((balanceDrops) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ownerCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const ownerCount = pendingEntity.ownerCount}
					{#if ownerCount !== undefined && ownerCount !== null}
						<div>
							<dt>owner count</dt>
							<dd>
								{String((ownerCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ownerCount = resolvedEntity.ownerCount}
					{#if ownerCount !== undefined && ownerCount !== null}
						<div>
							<dt>owner count</dt>
							<dd>
								{String((ownerCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sequence: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sequence = pendingEntity.sequence}
					{#if sequence !== undefined && sequence !== null}
						<div>
							<dt>sequence</dt>
							<dd>
								{String((sequence) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sequence = resolvedEntity.sequence}
					{#if sequence !== undefined && sequence !== null}
						<div>
							<dt>sequence</dt>
							<dd>
								{String((sequence) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
