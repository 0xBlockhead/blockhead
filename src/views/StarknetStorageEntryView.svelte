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
			selection: EntityProxyResource<typeof schema, EntityType.StarknetStorageEntry>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.StarknetStorageEntry>>
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
	const starknetStorageEntry = $derived(selection({
		sources: [
			Source.Juno_JsonRpc,
			Source.Pathfinder_JsonRpc,
			Source.Starknet_JsonRpc,
		],
	}))
	const titleFallback = $derived([String((selection.entitySelector.storageKey ?? prefetched.storageKey) ?? '')].filter(Boolean).join(' ') || 'starknet storage entry')
	const viewDomId = $derived('starknet-storage-entry-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import StarknetStorageEntry_TimestampsView from '$/views/StarknetStorageEntry_TimestampsView.svelte'
	import StarknetContractView from '$/views/StarknetContractView.svelte'
</script>


<EntityView
	entityType={EntityType.StarknetStorageEntry}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={starknetStorageEntry}>
			{#snippet Pending()}
				{[String((selection.entitySelector.storageKey ?? prefetched.storageKey) ?? '')].filter(Boolean).join(' ') || title || 'starknet storage entry'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.storageKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={starknetStorageEntry}>
			{#snippet Pending()}
				<StarknetContractView
					selection={select(EntityType.StarknetContract, selection.entitySelector.$contract)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<StarknetContractView
					selection={select(EntityType.StarknetContract, selection.entitySelector.$contract)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>contract</dt>
				<dd>
					<StarknetContractView
						selection={select(EntityType.StarknetContract, selection.entitySelector.$contract)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>storage key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									storageKey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const storageKey = selection.entitySelector.storageKey ?? prefetched.storageKey}
							{#if storageKey !== undefined && storageKey !== null}
								{String((storageKey) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const storageKey = resolvedEntity.storageKey}
							{#if storageKey !== undefined && storageKey !== null}
								{String((storageKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<StarknetStorageEntry_TimestampsView
				selection={selection[EntityProxyField]<EntityType.StarknetStorageEntry_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No Starknet storage observations.'
				id='StarknetStorageEntry_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
