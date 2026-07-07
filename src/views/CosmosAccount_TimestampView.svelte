<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosAccount_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CosmosAccount_Timestamp>>
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
	const cosmosAccountTimestamp = $derived(selection({
		fields: {
			accountNumber: true,
			sequence: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.source ?? prefetched.source) ?? '')].filter(Boolean).join(' ') || 'Cosmos account timestamp')
	const viewDomId = $derived('cosmos-account-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CosmosAccountView from '$/views/CosmosAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosAccount_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$account !== undefined && pendingEntity.$account.$network !== undefined && pendingEntity.$account.$network.caip2 !== undefined && pendingEntity.$account.$network.caip2.namespace !== undefined && pendingEntity.$account !== undefined && pendingEntity.$account.$network !== undefined && pendingEntity.$account.$network.caip2 !== undefined && pendingEntity.$account.$network.caip2.reference !== undefined && pendingEntity.$account !== undefined && pendingEntity.$account.address !== undefined && pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/account/[address]/observations/[timestampMs=nonNegativeInteger]/[source]', {
			caip2: `${String(pendingEntity.$account.$network.caip2.namespace ?? '')}:${String(pendingEntity.$account.$network.caip2.reference ?? '')}`,
			address: String(pendingEntity.$account.address ?? ''),
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cosmosAccountTimestamp}>
			{#snippet Pending()}
				{[String((selection.entitySelector.source ?? prefetched.source) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos account timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.source) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cosmosAccountTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.accountNumber) ?? ''), String((prefetched.sequence) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.source ?? prefetched.source) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos account timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.accountNumber) ?? ''), String((resolvedEntity.sequence) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.source) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cosmosAccountTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
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
							accountNumber: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const accountNumber = prefetched.accountNumber}
					{#if accountNumber !== undefined && accountNumber !== null}
						<div>
							<dt>Account number</dt>
							<dd>
								<TruncatedValue value={String((accountNumber) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const accountNumber = resolvedEntity.accountNumber}
					{#if accountNumber !== undefined && accountNumber !== null}
						<div>
							<dt>Account number</dt>
							<dd>
								<TruncatedValue value={String((accountNumber) ?? '')} />
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
					{@const sequence = prefetched.sequence}
					{#if sequence !== undefined && sequence !== null}
						<div>
							<dt>Sequence</dt>
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
							<dt>Sequence</dt>
							<dd>
								{String((sequence) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Account</dt>
				<dd>
					<CosmosAccountView
						selection={select(EntityType.CosmosAccount, selection.entitySelector.$account, {})}
						href={
							(selection.entitySelector.$account.$network !== undefined && selection.entitySelector.$account.$network.caip2 !== undefined && selection.entitySelector.$account.$network.caip2.namespace !== undefined && selection.entitySelector.$account.$network !== undefined && selection.entitySelector.$account.$network.caip2 !== undefined && selection.entitySelector.$account.$network.caip2.reference !== undefined && selection.entitySelector.$account.address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/account/[address]', {
								caip2: `${String(selection.entitySelector.$account.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$account.$network.caip2.reference ?? '')}`,
								address: String(selection.entitySelector.$account.address ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
