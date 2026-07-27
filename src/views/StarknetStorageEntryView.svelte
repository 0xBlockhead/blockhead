<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.StarknetStorageEntry> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = $derived((pendingEntity.storageKey ?? '') || 'starknet storage entry')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import StarknetStorageEntry_TimestampsView from '$/views/StarknetStorageEntry_TimestampsView.svelte'
	import StarknetContractView from '$/views/StarknetContractView.svelte'
</script>


<EntityView
	entityType={EntityType.StarknetStorageEntry}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.storageKey ?? '') || 'starknet storage entry'}
	{/snippet}

	{#snippet Value()}
		<StarknetContractView
			selection={select(EntityType.StarknetContract, selection.entitySelector.$contract)}
			href=""
			layout={EntityLayout.Value}
			open={false}
		/>
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
					{pendingEntity.storageKey}
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const starknetStorageEntryStarknetStorageEntryTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={starknetStorageEntryStarknetStorageEntryTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<StarknetStorageEntry_TimestampsView
						selection={starknetStorageEntryStarknetStorageEntryTimestampsViewTimestampsResource}
						countResource={starknetStorageEntryStarknetStorageEntryTimestampsViewTimestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
