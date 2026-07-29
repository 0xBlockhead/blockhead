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
	}: EntitySelectionViewProps<EntityType.SuiEvent> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SuiNetworkView from '$/views/SuiNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiEvent}
	entitySelector={selection.entitySelector}
	title={title ?? 'Sui event'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		Sui event
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
				<dt>transaction digest</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.transactionDigest} />
				</dd>
			</div>

			<div>
				<dt>event index</dt>
				<dd>
					{selection.entitySelector.eventIndex}
				</dd>
			</div>

			<div>
				<dt>event type</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									eventType: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.eventType}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							packageId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const packageId = entity.packageId}
					{#if packageId != null}
						<div>
							<dt>package ID</dt>
							<dd>
								{packageId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							moduleName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const moduleName = entity.moduleName}
					{#if moduleName != null}
						<div>
							<dt>module name</dt>
							<dd>
								{moduleName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sender: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sender = entity.sender}
					{#if sender != null}
						<div>
							<dt>sender</dt>
							<dd>
								{sender}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
