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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosValidator_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CosmosValidator_Timestamp>>
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
	const cosmosValidatorTimestamp = $derived(selection({
		fields: {
			status: true,
			tokens: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.source ?? prefetched.source) ?? '')].filter(Boolean).join(' ') || 'Cosmos validator timestamp')
	const viewDomId = $derived('cosmos-validator-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import CosmosValidatorView from '$/views/CosmosValidatorView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosValidator_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$validator !== undefined && pendingEntity.$validator.$network !== undefined && pendingEntity.$validator.$network.caip2 !== undefined && pendingEntity.$validator.$network.caip2.namespace !== undefined && pendingEntity.$validator !== undefined && pendingEntity.$validator.$network !== undefined && pendingEntity.$validator.$network.caip2 !== undefined && pendingEntity.$validator.$network.caip2.reference !== undefined && pendingEntity.$validator !== undefined && pendingEntity.$validator.operatorAddress !== undefined && pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/validator/[operatorAddress]/observations/[timestampMs=nonNegativeInteger]/[source]', {
			caip2: `${String(pendingEntity.$validator.$network.caip2.namespace ?? '')}:${String(pendingEntity.$validator.$network.caip2.reference ?? '')}`,
			operatorAddress: String(pendingEntity.$validator.operatorAddress ?? ''),
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cosmosValidatorTimestamp}>
			{#snippet Pending()}
				{[String((selection.entitySelector.source ?? prefetched.source) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos validator timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.source) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cosmosValidatorTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.status) ?? ''), String((prefetched.tokens) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.source ?? prefetched.source) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos validator timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.status) ?? ''), String((resolvedEntity.tokens) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.source) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cosmosValidatorTimestamp}>
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
							jailed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const jailed = prefetched.jailed}
					{#if jailed !== undefined && jailed !== null}
						<div>
							<dt>Jailed</dt>
							<dd>
								{jailed ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const jailed = resolvedEntity.jailed}
					{#if jailed !== undefined && jailed !== null}
						<div>
							<dt>Jailed</dt>
							<dd>
								{jailed ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							status: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const status = prefetched.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>Status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const status = resolvedEntity.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>Status</dt>
							<dd>
								{String((status) ?? '')}
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
							tokens: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tokens = prefetched.tokens}
					{#if tokens !== undefined && tokens !== null}
						<div>
							<dt>Tokens</dt>
							<dd>
								{String((tokens) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tokens = resolvedEntity.tokens}
					{#if tokens !== undefined && tokens !== null}
						<div>
							<dt>Tokens</dt>
							<dd>
								{String((tokens) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							delegatorShares: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const delegatorShares = prefetched.delegatorShares}
					{#if delegatorShares !== undefined && delegatorShares !== null}
						<div>
							<dt>Delegator shares</dt>
							<dd>
								{String((delegatorShares) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const delegatorShares = resolvedEntity.delegatorShares}
					{#if delegatorShares !== undefined && delegatorShares !== null}
						<div>
							<dt>Delegator shares</dt>
							<dd>
								{String((delegatorShares) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							commissionRate: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const commissionRate = prefetched.commissionRate}
					{#if commissionRate !== undefined && commissionRate !== null}
						<div>
							<dt>Commission rate</dt>
							<dd>
								{String((commissionRate) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const commissionRate = resolvedEntity.commissionRate}
					{#if commissionRate !== undefined && commissionRate !== null}
						<div>
							<dt>Commission rate</dt>
							<dd>
								{String((commissionRate) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							minSelfDelegation: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const minSelfDelegation = prefetched.minSelfDelegation}
					{#if minSelfDelegation !== undefined && minSelfDelegation !== null}
						<div>
							<dt>Minimum self delegation</dt>
							<dd>
								{String((minSelfDelegation) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const minSelfDelegation = resolvedEntity.minSelfDelegation}
					{#if minSelfDelegation !== undefined && minSelfDelegation !== null}
						<div>
							<dt>Minimum self delegation</dt>
							<dd>
								{String((minSelfDelegation) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Validator</dt>
				<dd>
					<CosmosValidatorView
						selection={select(EntityType.CosmosValidator, selection.entitySelector.$validator, {})}
						href={
							(selection.entitySelector.$validator.$network !== undefined && selection.entitySelector.$validator.$network.caip2 !== undefined && selection.entitySelector.$validator.$network.caip2.namespace !== undefined && selection.entitySelector.$validator.$network !== undefined && selection.entitySelector.$validator.$network.caip2 !== undefined && selection.entitySelector.$validator.$network.caip2.reference !== undefined && selection.entitySelector.$validator.operatorAddress !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/validator/[operatorAddress]', {
								caip2: `${String(selection.entitySelector.$validator.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$validator.$network.caip2.reference ?? '')}`,
								operatorAddress: String(selection.entitySelector.$validator.operatorAddress ?? ''),
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
