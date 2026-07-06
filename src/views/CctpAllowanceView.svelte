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
			selection: EntityProxyResource<typeof schema, EntityType.CctpAllowance>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CctpAllowance>>
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
	const cctpAllowance = $derived(selection({
		fields: {
			allowance: true,
			fetchedAt: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.apiHost ?? prefetched.apiHost) ?? '')].filter(Boolean).join(' ') || 'CCTP allowance')
	const viewDomId = $derived('cctp-allowance-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
</script>


<EntityView
	entityType={EntityType.CctpAllowance}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cctpAllowance}>
			{#snippet Pending()}
				{[String((selection.entitySelector.apiHost ?? prefetched.apiHost) ?? '')].filter(Boolean).join(' ') || title || 'CCTP allowance'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.apiHost) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cctpAllowance}>
			{#snippet Pending()}
				{[String((prefetched.allowance) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.apiHost ?? prefetched.apiHost) ?? '')].filter(Boolean).join(' ') || title || 'CCTP allowance'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.allowance) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.apiHost) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cctpAllowance}>
			{#snippet Pending()}
				{@const fetchedAt0 = prefetched.fetchedAt}
				{#if fetchedAt0 !== undefined && fetchedAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(fetchedAt0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const fetchedAt0 = resolvedEntity.fetchedAt}
				{#if fetchedAt0 !== undefined && fetchedAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(fetchedAt0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>API host</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									apiHost: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const apiHost = selection.entitySelector.apiHost ?? prefetched.apiHost}
							{#if apiHost !== undefined && apiHost !== null}
								{String((apiHost) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const apiHost = resolvedEntity.apiHost}
							{#if apiHost !== undefined && apiHost !== null}
								{String((apiHost) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							allowance: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const allowance = prefetched.allowance}
					{#if allowance !== undefined && allowance !== null}
						<div>
							<dt>Allowance</dt>
							<dd>
								{String((allowance) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const allowance = resolvedEntity.allowance}
					{#if allowance !== undefined && allowance !== null}
						<div>
							<dt>Allowance</dt>
							<dd>
								{String((allowance) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Fetched at</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									fetchedAt: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const fetchedAt = prefetched.fetchedAt}
							{#if fetchedAt !== undefined && fetchedAt !== null}
								<Timestamp timestamp={Number(fetchedAt)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const fetchedAt = resolvedEntity.fetchedAt}
							{#if fetchedAt !== undefined && fetchedAt !== null}
								<Timestamp timestamp={Number(fetchedAt)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
