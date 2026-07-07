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
			selection: EntityProxyResource<typeof schema, EntityType.AlgorandApplication>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AlgorandApplication>>
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
	const algorandApplication = $derived(selection({
		fields: {
			creator: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.applicationId ?? prefetched.applicationId) ?? '')].filter(Boolean).join(' ') || 'algorand application')
	const viewDomId = $derived('algorand-application-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AlgorandBoxesView from '$/views/AlgorandBoxesView.svelte'
	import AlgorandApplicationLocalState_RoundsView from '$/views/AlgorandApplicationLocalState_RoundsView.svelte'
	import AlgorandApplication_TimestampsView from '$/views/AlgorandApplication_TimestampsView.svelte'
	import AlgorandNetworkView from '$/views/AlgorandNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.AlgorandApplication}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={algorandApplication}>
			{#snippet Pending()}
				{[String((selection.entitySelector.applicationId ?? prefetched.applicationId) ?? '')].filter(Boolean).join(' ') || title || 'algorand application'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.applicationId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={algorandApplication}>
			{#snippet Pending()}
				<AlgorandNetworkView
					selection={select(EntityType.AlgorandNetwork, selection.entitySelector.$network)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<AlgorandNetworkView
					selection={select(EntityType.AlgorandNetwork, selection.entitySelector.$network)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={algorandApplication}>
			{#snippet Pending()}
				{@const creator0 = prefetched.creator}
				{#if creator0 !== undefined && creator0 !== null}
					<span data-text="muted">
						{String((creator0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const creator0 = resolvedEntity.creator}
				{#if creator0 !== undefined && creator0 !== null}
					<span data-text="muted">
						{String((creator0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<AlgorandNetworkView
						selection={select(EntityType.AlgorandNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>application ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									applicationId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const applicationId = selection.entitySelector.applicationId ?? prefetched.applicationId}
							{#if applicationId !== undefined && applicationId !== null}
								{String((applicationId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const applicationId = resolvedEntity.applicationId}
							{#if applicationId !== undefined && applicationId !== null}
								{String((applicationId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							creator: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const creator = prefetched.creator}
					{#if creator !== undefined && creator !== null}
						<div>
							<dt>creator</dt>
							<dd>
								{String((creator) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const creator = resolvedEntity.creator}
					{#if creator !== undefined && creator !== null}
						<div>
							<dt>creator</dt>
							<dd>
								{String((creator) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<AlgorandBoxesView
				selection={selection[EntityProxyField]<EntityType.AlgorandBox>('$$boxes')}
				title='boxes'
				emptyText='No Algorand boxes.'
				id='AlgorandBoxesView-$$boxes'
			/>

			<AlgorandApplicationLocalState_RoundsView
				selection={selection[EntityProxyField]<EntityType.AlgorandApplicationLocalState_Round>('$$localStateRounds')}
				title='local state rounds'
				emptyText='No Algorand application local state rounds.'
				id='AlgorandApplicationLocalState_RoundsView-$$localStateRounds'
			/>

			<AlgorandApplication_TimestampsView
				selection={selection[EntityProxyField]<EntityType.AlgorandApplication_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No Algorand application observations.'
				id='AlgorandApplication_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
