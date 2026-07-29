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


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import StarknetStorageEntry_TimestampsView from '$/views/StarknetStorageEntry_TimestampsView.svelte'
	import StarknetContractView from '$/views/StarknetContractView.svelte'
</script>


<EntityView
	entityType={EntityType.StarknetStorageEntry}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.storageKey || 'starknet storage entry')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{selection.entitySelector.storageKey || 'starknet storage entry'}
	{/snippet}

	{#snippet Value()}
		<StarknetContractView
			selection={select(EntityType.StarknetContract, selection.entitySelector.$contract)}
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
					{selection.entitySelector.storageKey}
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<StarknetStorageEntry_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
