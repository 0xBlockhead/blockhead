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
	}: Omit<EntitySelectionViewProps<EntityType.StellarOperation>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import StellarTransactionView from '$/views/StellarTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.StellarOperation}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<StellarTransactionView
						selection={select(EntityType.StellarTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>operation index</dt>
				<dd>
					{selection.entitySelector.operationIndex}
				</dd>
			</div>

			<div>
				<dt>operation type</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									operationType: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.operationType}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceAccount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceAccount = entity.sourceAccount}
					{#if sourceAccount != null}
						<div>
							<dt>source account</dt>
							<dd>
								<TruncatedValue value={sourceAccount} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							resultCode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resultCode = entity.resultCode}
					{#if resultCode != null}
						<div>
							<dt>result code</dt>
							<dd>
								{resultCode}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
