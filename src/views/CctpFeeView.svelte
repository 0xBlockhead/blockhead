<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.CctpFee>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.CctpFee>>
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
	const cctpFee = $derived(selection({}))
	const titleFallback = $derived([String((pendingEntity.apiHost) ?? '')].filter(Boolean).join(' ') || 'CCTP fee')
	const viewDomId = $derived('cctp-fee-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.CctpFee}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cctpFee}>
			{#snippet Pending()}
				{[String((pendingEntity.apiHost) ?? '')].filter(Boolean).join(' ') || title || 'CCTP fee'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.apiHost) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cctpFee}>
			{#snippet Pending()}
				{[String((pendingEntity.fromDomain) ?? ''), String((pendingEntity.toDomain) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.apiHost) ?? '')].filter(Boolean).join(' ') || title || 'CCTP fee'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.fromDomain) ?? ''), String((resolvedEntity.toDomain) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.apiHost) ?? '')].filter(Boolean).join(' ') || titleFallback}
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
							{@const apiHost = pendingEntity.apiHost}
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

			<div>
				<dt>From domain</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									fromDomain: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const fromDomain = pendingEntity.fromDomain}
							{#if fromDomain !== undefined && fromDomain !== null}
								{String((fromDomain) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const fromDomain = resolvedEntity.fromDomain}
							{#if fromDomain !== undefined && fromDomain !== null}
								{String((fromDomain) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>To domain</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									toDomain: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const toDomain = pendingEntity.toDomain}
							{#if toDomain !== undefined && toDomain !== null}
								{String((toDomain) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const toDomain = resolvedEntity.toDomain}
							{#if toDomain !== undefined && toDomain !== null}
								{String((toDomain) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
