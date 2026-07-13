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
			selection: EntityProxyResource<typeof schema, EntityType.ComplianceModule>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.ComplianceModule>>
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
	const complianceModule = $derived(selection({}))
	const titleFallback = $derived('compliance module')
	const viewDomId = $derived('compliance-module-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import RegulatedAssetProfileView from '$/views/RegulatedAssetProfileView.svelte'
</script>


<EntityView
	entityType={EntityType.ComplianceModule}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={complianceModule}>
			{#snippet Pending()}
				{title || 'compliance module'}
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
				<dt>profile</dt>
				<dd>
					<RegulatedAssetProfileView
						selection={select(EntityType.RegulatedAssetProfile, selection.entitySelector.$profile, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>module key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									moduleKey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const moduleKey = pendingEntity.moduleKey}
							{#if moduleKey !== undefined && moduleKey !== null}
								{String((moduleKey) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const moduleKey = resolvedEntity.moduleKey}
							{#if moduleKey !== undefined && moduleKey !== null}
								{String((moduleKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ruleKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const ruleKind = pendingEntity.ruleKind}
					{#if ruleKind !== undefined && ruleKind !== null}
						<div>
							<dt>rule kind</dt>
							<dd>
								{String((ruleKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ruleKind = resolvedEntity.ruleKind}
					{#if ruleKind !== undefined && ruleKind !== null}
						<div>
							<dt>rule kind</dt>
							<dd>
								{String((ruleKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
