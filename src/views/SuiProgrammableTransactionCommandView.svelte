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
	}: EntitySelectionViewProps<EntityType.SuiProgrammableTransactionCommand> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SuiTransactionView from '$/views/SuiTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiProgrammableTransactionCommand}
	entitySelector={selection.entitySelector}
	title={title ?? 'Sui programmable transaction command'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<SuiTransactionView
						selection={select(EntityType.SuiTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>command index</dt>
				<dd>
					{selection.entitySelector.commandIndex}
				</dd>
			</div>

			<div>
				<dt>command kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									commandKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.commandKind}
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
							functionName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const functionName = entity.functionName}
					{#if functionName != null}
						<div>
							<dt>function name</dt>
							<dd>
								{functionName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>type arguments</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									typeArguments: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.typeArguments.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
