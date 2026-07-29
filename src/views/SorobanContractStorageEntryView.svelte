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
	}: EntitySelectionViewProps<EntityType.SorobanContractStorageEntry> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SorobanContractView from '$/views/SorobanContractView.svelte'
</script>


<EntityView
	entityType={EntityType.SorobanContractStorageEntry}
	entitySelector={selection.entitySelector}
	title={title ?? 'soroban contract storage entry'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		soroban contract storage entry
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>contract</dt>
				<dd>
					<SorobanContractView
						selection={select(EntityType.SorobanContract, selection.entitySelector.$contract)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>key hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.keyHash} />
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
