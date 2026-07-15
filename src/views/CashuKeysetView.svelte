<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.CashuKeyset>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.CashuKeyset>>
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
	const cashuKeyset = $derived(selection({
		sources: [
			Source.CashuMint_Rest,
		],
		fields: {
			unit: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.keysetId) ?? '')].filter(Boolean).join(' ') || 'Cashu keyset')
	const viewDomId = $derived('cashu-keyset-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CashuMintView from '$/views/CashuMintView.svelte'
	import CashuKeyset_TimestampsView from '$/views/CashuKeyset_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.CashuKeyset}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cashuKeyset}>
			{#snippet Pending()}
				{@const keysetId0 = pendingEntity.keysetId}
				{#if keysetId0 !== undefined && keysetId0 !== null}
					<TruncatedValue value={String((keysetId0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const keysetId0 = resolvedEntity.keysetId}
				{#if keysetId0 !== undefined && keysetId0 !== null}
					<TruncatedValue value={String((keysetId0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cashuKeyset}>
			{#snippet Pending()}
				{[String((pendingEntity.unit) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.keysetId) ?? '')].filter(Boolean).join(' ') || title || 'Cashu keyset'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.unit) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.keysetId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cashuKeyset}>
			{#snippet Pending()}
				<span data-text="muted">
					<CashuMintView
						selection={select(EntityType.CashuMint, selection.entitySelector.$mint)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
					<CashuMintView
						selection={select(EntityType.CashuMint, selection.entitySelector.$mint)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>mint</dt>
				<dd>
					<CashuMintView
						selection={select(EntityType.CashuMint, selection.entitySelector.$mint, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>keyset ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									keysetId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const keysetId = pendingEntity.keysetId}
							{#if keysetId !== undefined && keysetId !== null}
								<TruncatedValue value={String((keysetId) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const keysetId = resolvedEntity.keysetId}
							{#if keysetId !== undefined && keysetId !== null}
								<TruncatedValue value={String((keysetId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.CashuMint_Rest,
						],
						fields: {
							unit: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const unit = pendingEntity.unit}
					{#if unit !== undefined && unit !== null}
						<div>
							<dt>unit</dt>
							<dd>
								{String((unit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const unit = resolvedEntity.unit}
					{#if unit !== undefined && unit !== null}
						<div>
							<dt>unit</dt>
							<dd>
								{String((unit) ?? '')}
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
						sources: [
							Source.CashuMint_Rest,
						],
						fields: {
							keysByAmountJson: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const keysByAmountJson = pendingEntity.keysByAmountJson}
					{#if keysByAmountJson !== undefined && keysByAmountJson !== null}
						<div>
							<dt>keys by amount JSON</dt>
							<dd>
								{String((keysByAmountJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const keysByAmountJson = resolvedEntity.keysByAmountJson}
					{#if keysByAmountJson !== undefined && keysByAmountJson !== null}
						<div>
							<dt>keys by amount JSON</dt>
							<dd>
								{String((keysByAmountJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-cashu-keyset-observations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'cashu-keyset-timestamps',
							label: 'Observations',
						},
					]
				}
				data-card
				class='network-view-collapsible-observations'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Observations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionCashuKeysetTimestamps({ id, label, open })}
					<CashuKeyset_TimestampsView
						selection={
							selection.$$timestamps({
								sources: [
									Source.CashuMint_Rest,
								],
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No keyset observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
