<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.SuiProgrammableTransactionCommand>, 'prefetched'> = $props()

	const transaction = $derived(selection.entitySelector.$transaction)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SuiTransactionView from '$/views/SuiTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiProgrammableTransactionCommand}
	entitySelector={selection.entitySelector}
	title={title ?? 'Sui programmable transaction command'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/sui-tx/[digest=stringSegment]/(suiTransaction)/command/[commandIndex=nonNegativeInteger]',
				{
					network: (
						'caip2' in transaction.$network.$network ?
							caip2StringFromValue(transaction.$network.$network.caip2)
						:
							transaction.$network.$network.slug
					),
					digest: transaction.digest,
					commandIndex: String(selection.entitySelector.commandIndex),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
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
