<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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

	const cosmosValidatorTimestamp = $derived(selection({
		fields: {
			status: true,
			tokens: true,
			jailed: true,
			delegatorShares: true,
			commissionRate: true,
			minSelfDelegation: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || 'Cosmos validator timestamp')
	const viewDomId = $derived('cosmos-validator-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CosmosValidatorView from '$/views/CosmosValidatorView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosValidator_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/validator/[operatorAddress]/observations/[timestampMs=nonNegativeInteger]/[source]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$validator.$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$validator.$network.caip2.reference)}`,
			operatorAddress: String(({ ...selection.entitySelector, ...prefetched }).$validator.operatorAddress),
			timestampMs: String(({ ...selection.entitySelector, ...prefetched }).timestampMs),
			source: String(({ ...selection.entitySelector, ...prefetched }).source),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos validator timestamp'}
		{:else}
			<ResourceBoundary resource={cosmosValidatorTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos validator timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.source) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).status) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).tokens) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos validator timestamp'}
		{:else}
			<ResourceBoundary resource={cosmosValidatorTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).status) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).tokens) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos validator timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.status) ?? ''), String((entity.tokens) ?? '')].filter(Boolean).join(' ') || [String((entity.source) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const timestampMs0 = prefetched.timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<span data-text="muted">
					{String((timestampMs0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={cosmosValidatorTimestamp}>
				{#snippet Pending()}
					{@const timestampMs0 = prefetched.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<span data-text="muted">
							{String((timestampMs0) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const timestampMs0 = entity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<span data-text="muted">
							{String((timestampMs0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={cosmosValidatorTimestamp}>
				{#snippet Pending()}
					{@const jailed = prefetched.jailed ?? selection.entitySelector.jailed}
					{#if jailed !== undefined && jailed !== null}
						<div>
							<dt>Jailed</dt>
							<dd>
								{String((jailed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const jailed = entity.jailed ?? selection.entitySelector.jailed ?? prefetched.jailed}
					{#if jailed !== undefined && jailed !== null}
						<div>
							<dt>Jailed</dt>
							<dd>
								{String((jailed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={cosmosValidatorTimestamp}>
				{#snippet Pending()}
					{@const delegatorShares = prefetched.delegatorShares ?? selection.entitySelector.delegatorShares}
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
					{@const delegatorShares = entity.delegatorShares ?? selection.entitySelector.delegatorShares ?? prefetched.delegatorShares}
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

			<ResourceBoundary resource={cosmosValidatorTimestamp}>
				{#snippet Pending()}
					{@const commissionRate = prefetched.commissionRate ?? selection.entitySelector.commissionRate}
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
					{@const commissionRate = entity.commissionRate ?? selection.entitySelector.commissionRate ?? prefetched.commissionRate}
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

			<ResourceBoundary resource={cosmosValidatorTimestamp}>
				{#snippet Pending()}
					{@const minSelfDelegation = prefetched.minSelfDelegation ?? selection.entitySelector.minSelfDelegation}
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
					{@const minSelfDelegation = entity.minSelfDelegation ?? selection.entitySelector.minSelfDelegation ?? prefetched.minSelfDelegation}
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
						selection={select(EntityType.CosmosValidator, selection.entitySelector.$validator)}
						href={
							resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/validator/[operatorAddress]', {
								caip2: `${String(selection.entitySelector.$validator.$network.caip2.namespace)}:${String(selection.entitySelector.$validator.$network.caip2.reference)}`,
								operatorAddress: String(selection.entitySelector.$validator.operatorAddress),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
