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
	}: Omit<EntitySelectionViewProps<EntityType.SuiEvent>, 'prefetched'> = $props()


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SuiNetworkView from '$/views/SuiNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiEvent}
	entitySelector={selection.entitySelector}
	title={title ?? 'Sui event'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/transaction/[transactionDigest=stringSegment]/event/[eventIndex=nonNegativeInteger]',
				{
					network: (
						'caip2' in selection.entitySelector.$network.$network ?
							caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
						:
							selection.entitySelector.$network.$network.slug
					),
					transactionDigest: selection.entitySelector.transactionDigest,
					eventIndex: String(selection.entitySelector.eventIndex),
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
				<dt>network</dt>
				<dd>
					<SuiNetworkView
						selection={select(EntityType.SuiNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
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
					<NumberValue
						value={selection.entitySelector.eventIndex}
					/>
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
		</dl>

		<dl data-column-item="center">
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

		<ResourceBoundary
			resource={
				selection({
					fields: {
						value: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const value = entity.value}
				{#if value != null && value !== ''}
					<code>{JSON.stringify(value)}</code>
				{:else}
					<p data-text="muted">No event value available.</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
