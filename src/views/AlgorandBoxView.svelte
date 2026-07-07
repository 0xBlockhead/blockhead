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
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.AlgorandBox>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AlgorandBox>>
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
	const algorandBox = $derived(selection({}))
	const titleFallback = $derived('algorand box')
	const viewDomId = $derived('algorand-box-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AlgorandBox_RoundsView from '$/views/AlgorandBox_RoundsView.svelte'
	import AlgorandApplicationView from '$/views/AlgorandApplicationView.svelte'
</script>


<EntityView
	entityType={EntityType.AlgorandBox}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={algorandBox}>
			{#snippet Pending()}
				{title || 'algorand box'}
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
				<dt>application</dt>
				<dd>
					<AlgorandApplicationView
						selection={select(EntityType.AlgorandApplication, selection.entitySelector.$application, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>box name</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									boxName: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const boxName = selection.entitySelector.boxName ?? prefetched.boxName}
							{#if boxName !== undefined && boxName !== null}
								{String((boxName) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const boxName = resolvedEntity.boxName}
							{#if boxName !== undefined && boxName !== null}
								{String((boxName) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<AlgorandBox_RoundsView
				selection={selection[EntityProxyField]<EntityType.AlgorandBox_Round>('$$rounds')}
				title='rounds'
				emptyText='No Algorand box rounds.'
				id='AlgorandBox_RoundsView-$$rounds'
			/>
		{/if}
	{/snippet}
</EntityView>
