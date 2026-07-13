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
			selection: EntityProxyResource<typeof schema, EntityType.AvailAppId>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AvailAppId>>
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
	const availAppId = $derived(selection({
		fields: {
			label: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.appId) ?? '')].filter(Boolean).join(' ') || 'avail app ID')
	const viewDomId = $derived('avail-app-id-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AvailAppId_TimestampsView from '$/views/AvailAppId_TimestampsView.svelte'
	import AvailDataSubmissionsView from '$/views/AvailDataSubmissionsView.svelte'
	import AvailNetworkView from '$/views/AvailNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.AvailAppId}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={availAppId}>
			{#snippet Pending()}
				{[String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.appId) ?? '')].filter(Boolean).join(' ') || 'avail app ID'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={availAppId}>
			{#snippet Pending()}
				{@const appId0 = pendingEntity.appId}
				{#if appId0 !== undefined && appId0 !== null}
					<NumberValue value={Number(appId0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const appId0 = resolvedEntity.appId}
				{#if appId0 !== undefined && appId0 !== null}
					<NumberValue value={Number(appId0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<AvailNetworkView
						selection={select(EntityType.AvailNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>app ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									appId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const appId = pendingEntity.appId}
							{#if appId !== undefined && appId !== null}
								<NumberValue value={Number(appId)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const appId = resolvedEntity.appId}
							{#if appId !== undefined && appId !== null}
								<NumberValue value={Number(appId)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							label: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const label = pendingEntity.label}
					{#if label !== undefined && label !== null}
						<div>
							<dt>Label</dt>
							<dd>
								{String((label) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const label = resolvedEntity.label}
					{#if label !== undefined && label !== null}
						<div>
							<dt>Label</dt>
							<dd>
								{String((label) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<AvailAppId_TimestampsView
				selection={selection.$$timestamps}
				title='timestamps'
				emptyText='No observations yet.'
				id='AvailAppId_TimestampsView-timestamps'
			/>

			<AvailDataSubmissionsView
				selection={selection.$$dataSubmissions}
				title='data submissions'
				emptyText='No data submissions found.'
				id='AvailDataSubmissionsView-data-submissions'
			/>
		{/if}
	{/snippet}
</EntityView>
