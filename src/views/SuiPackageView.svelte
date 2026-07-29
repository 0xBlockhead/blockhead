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
	}: EntitySelectionViewProps<EntityType.SuiPackage> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SuiNetworkView from '$/views/SuiNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiPackage}
	entitySelector={selection.entitySelector}
	title={title ?? 'Sui package'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		Sui package
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<SuiNetworkView
						selection={select(EntityType.SuiNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>original package ID</dt>
				<dd>
					{selection.entitySelector.originalPackageId}
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
