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
	}: EntitySelectionViewProps<EntityType.TonWorkchain> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.TonWorkchain}
	entitySelector={selection.entitySelector}
	title={title ?? 'TON workchain'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		TON workchain
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>workchain</dt>
				<dd>
					{selection.entitySelector.workchain}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							label: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const label = entity.label}
					{#if label != null}
						<div>
							<dt>Label</dt>
							<dd>
								{label}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							addressFormat: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const addressFormat = entity.addressFormat}
					{#if addressFormat != null}
						<div>
							<dt>address format</dt>
							<dd>
								{addressFormat}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionFormat: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionFormat = entity.transactionFormat}
					{#if transactionFormat != null}
						<div>
							<dt>transaction format</dt>
							<dd>
								{transactionFormat}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							virtualMachine: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const virtualMachine = entity.virtualMachine}
					{#if virtualMachine != null}
						<div>
							<dt>virtual machine</dt>
							<dd>
								{virtualMachine}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
