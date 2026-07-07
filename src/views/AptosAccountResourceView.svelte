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
			selection: EntityProxyResource<typeof schema, EntityType.AptosAccountResource>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AptosAccountResource>>
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
	const aptosAccountResource = $derived(selection({}))
	const titleFallback = $derived([String((selection.entitySelector.resourceType ?? prefetched.resourceType) ?? '')].filter(Boolean).join(' ') || 'aptos account resource')
	const viewDomId = $derived('aptos-account-resource-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AptosAccountResource_TimestampsView from '$/views/AptosAccountResource_TimestampsView.svelte'
	import AptosAccountView from '$/views/AptosAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.AptosAccountResource}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={aptosAccountResource}>
			{#snippet Pending()}
				{[String((selection.entitySelector.resourceType ?? prefetched.resourceType) ?? '')].filter(Boolean).join(' ') || title || 'aptos account resource'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.resourceType) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aptosAccountResource}>
			{#snippet Pending()}
				<AptosAccountView
					selection={select(EntityType.AptosAccount, selection.entitySelector.$account)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<AptosAccountView
					selection={select(EntityType.AptosAccount, selection.entitySelector.$account)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>account</dt>
				<dd>
					<AptosAccountView
						selection={select(EntityType.AptosAccount, selection.entitySelector.$account, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>resource type</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									resourceType: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const resourceType = selection.entitySelector.resourceType ?? prefetched.resourceType}
							{#if resourceType !== undefined && resourceType !== null}
								{String((resourceType) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const resourceType = resolvedEntity.resourceType}
							{#if resourceType !== undefined && resourceType !== null}
								{String((resourceType) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<AptosAccountResource_TimestampsView
				selection={selection[EntityProxyField]<EntityType.AptosAccountResource_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No observations yet.'
				id='AptosAccountResource_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
