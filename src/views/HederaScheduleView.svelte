<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.HederaSchedule>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaSchedule}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>schedule ID</dt>
				<dd>
					{selection.entitySelector.scheduleId}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							creatorAccountId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const creatorAccountId = entity.creatorAccountId}
					{#if creatorAccountId != null}
						<div>
							<dt>creator account ID</dt>
							<dd>
								<TruncatedValue value={creatorAccountId} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							payerAccountId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const payerAccountId = entity.payerAccountId}
					{#if payerAccountId != null}
						<div>
							<dt>payer account ID</dt>
							<dd>
								<TruncatedValue value={payerAccountId} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
