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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.IssuerAction> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
	import IssuerPowerView from '$/views/IssuerPowerView.svelte'
</script>


<EntityView
	entityType={EntityType.IssuerAction}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>issuer action ID</dt>
				<dd>
					{selection.entitySelector.issuerActionId}
				</dd>
			</div>

			<div>
				<dt>action kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									actionKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.actionKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>asset instance</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$assetInstance}
					>
						{#snippet children(assetInstance)}
							<AssetInstanceView
								selection={select(EntityType.AssetInstance, assetInstance[EntityMetaKey.Selector])}
								prefetched={assetInstance}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							amount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const amount = entity.amount}
					{#if amount != null}
						<div>
							<dt>amount</dt>
							<dd>
								{amount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$issuerPower}
			>
				{#snippet children(issuerPower)}
					{#if issuerPower != null}
						<div>
							<dt>issuer power</dt>
							<dd>
								<IssuerPowerView
									selection={select(EntityType.IssuerPower, issuerPower[EntityMetaKey.Selector])}
									prefetched={issuerPower}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
