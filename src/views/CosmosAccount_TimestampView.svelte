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

	const cosmosAccountTimestamp = $derived(selection({
		fields: {
			accountNumber: true,
			sequence: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || 'Cosmos account timestamp')
	const viewDomId = $derived('cosmos-account-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CosmosAccountView from '$/views/CosmosAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosAccount_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/account/[address]/observations/[timestampMs=nonNegativeInteger]/[source]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$account.$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$account.$network.caip2.reference)}`,
			address: String(({ ...selection.entitySelector, ...prefetched }).$account.address),
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
			{[String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos account timestamp'}
		{:else}
			<ResourceBoundary resource={cosmosAccountTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos account timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.source) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).accountNumber) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).sequence) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos account timestamp'}
		{:else}
			<ResourceBoundary resource={cosmosAccountTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).accountNumber) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).sequence) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos account timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.accountNumber) ?? ''), String((entity.sequence) ?? '')].filter(Boolean).join(' ') || [String((entity.source) ?? '')].filter(Boolean).join(' ') || titleFallback}
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
			<ResourceBoundary resource={cosmosAccountTimestamp}>
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
			<div>
				<dt>Account</dt>
				<dd>
					<CosmosAccountView
						selection={select(EntityType.CosmosAccount, selection.entitySelector.$account)}
						href={
							resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/account/[address]', {
								caip2: `${String(selection.entitySelector.$account.$network.caip2.namespace)}:${String(selection.entitySelector.$account.$network.caip2.reference)}`,
								address: String(selection.entitySelector.$account.address),
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
