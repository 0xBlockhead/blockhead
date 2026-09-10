<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: Omit<EntitySelectionViewProps<EntityType.CelestiaBlobSubmission>, 'prefetched'> = $props()

	const blob = $derived(selection.entitySelector.$blob)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CosmosAccountsView from '$/views/CosmosAccountsView.svelte'
	import CelestiaBlobView from '$/views/CelestiaBlobView.svelte'
	import CosmosTransactionView from '$/views/CosmosTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.CelestiaBlobSubmission}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.txHash || 'celestia blob submission')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(celestia)/namespace/[namespaceId=stringSegment]/(celestiaNamespace)/blob/[height=nonNegativeBigInt]/[commitment=stringSegment]/(celestiaBlob)/submission/[txHash=stringSegment]',
				{
					network: (
						'caip2' in blob.$namespace.$network.$network ?
							caip2StringFromValue(blob.$namespace.$network.$network.caip2)
						:
							blob.$namespace.$network.$network.slug
					),
					namespaceId: blob.$namespace.namespaceId,
					height: String(blob.height),
					commitment: blob.commitment,
					txHash: selection.entitySelector.txHash,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={selection.entitySelector.txHash} />
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<CelestiaBlobView
				selection={select(EntityType.CelestiaBlob, selection.entitySelector.$blob)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>blob content</dt>
				<dd>
					<CelestiaBlobView
						selection={select(EntityType.CelestiaBlob, selection.entitySelector.$blob)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>transaction hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.txHash} />
				</dd>
			</div>

			<div>
				<dt>transaction</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$transaction}
					>
						{#snippet children(cosmosTransaction)}
							<CosmosTransactionView
								selection={select(EntityType.CosmosTransaction, cosmosTransaction[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const submittersResource = selection.$$submitters}
		<ResourceBoundary
			resource={submittersResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<CosmosAccountsView
						selection={submittersResource}
						countResource={submittersResource.count}
						title='PFB submitters'
						id='submitters'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
