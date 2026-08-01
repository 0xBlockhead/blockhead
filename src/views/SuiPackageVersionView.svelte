<!-- Generated from APP.ts. -->

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
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.SuiPackageVersion>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SuiNetworkView from '$/views/SuiNetworkView.svelte'
	import SuiPackageView from '$/views/SuiPackageView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiPackageVersion}
	entitySelector={selection.entitySelector}
	title={title ?? 'Sui package version'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<SuiNetworkView
						selection={select(EntityType.SuiNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$package}
			>
				{#snippet children(suiPackage)}
					{#if suiPackage != null}
						<div>
							<dt>package</dt>
							<dd>
								<SuiPackageView
									selection={select(EntityType.SuiPackage, suiPackage[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>package ID</dt>
				<dd>
					{selection.entitySelector.packageId}
				</dd>
			</div>

			<div>
				<dt>version</dt>
				<dd>
					{selection.entitySelector.version}
				</dd>
			</div>

			<div>
				<dt>digest</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.digest} />
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							previousPackageId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const previousPackageId = entity.previousPackageId}
					{#if previousPackageId != null}
						<div>
							<dt>previous package ID</dt>
							<dd>
								{previousPackageId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							upgradePolicy: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const upgradePolicy = entity.upgradePolicy}
					{#if upgradePolicy != null}
						<div>
							<dt>upgrade policy</dt>
							<dd>
								{upgradePolicy}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
