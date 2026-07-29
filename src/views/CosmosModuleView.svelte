<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: EntitySelectionViewProps<EntityType.CosmosModule> = $props()

	const titleFallback = $derived(selection.entitySelector.moduleName || 'Cosmos module')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CosmosAccountView from '$/views/CosmosAccountView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosModule}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{selection.entitySelector.moduleName || 'Cosmos module'}
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.moduleName || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NetworkView
				selection={select(EntityType.Network, selection.entitySelector.$network)}
				layout={EntityLayout.Title}
				open={false}
			/>
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Module name</dt>
				<dd>
					{selection.entitySelector.moduleName}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$authority}
			>
				{#snippet children(cosmosAccount)}
					{#if cosmosAccount != null}
						<div>
							<dt>Authority</dt>
							<dd>
								<CosmosAccountView
									selection={select(EntityType.CosmosAccount, cosmosAccount[EntityMetaKey.Selector])}
									prefetched={cosmosAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
