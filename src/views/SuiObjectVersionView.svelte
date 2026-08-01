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
	}: EntitySelectionViewProps<EntityType.SuiObjectVersion> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SuiNetworkView from '$/views/SuiNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiObjectVersion}
	entitySelector={selection.entitySelector}
	title={title ?? 'Sui object version'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
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

			<div>
				<dt>object ID</dt>
				<dd>
					{selection.entitySelector.objectId}
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
							objectType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const objectType = entity.objectType}
					{#if objectType != null}
						<div>
							<dt>object type</dt>
							<dd>
								{objectType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							previousTransaction: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const previousTransaction = entity.previousTransaction}
					{#if previousTransaction != null}
						<div>
							<dt>previous transaction</dt>
							<dd>
								{previousTransaction}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							storageRebate: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const storageRebate = entity.storageRebate}
					{#if storageRebate != null}
						<div>
							<dt>storage rebate</dt>
							<dd>
								{storageRebate}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
