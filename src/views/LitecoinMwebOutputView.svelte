<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.LitecoinMwebOutput> = $props()

	const transaction = $derived(selection.entitySelector.$transaction)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.LitecoinCore_JsonRpc,
		],
	}))
	const litecoinMwebOutput = $derived(viewSelection({
		fields: {
			commitment: true,
		},
	}))
	const titleFallback = $derived((prefetched.commitment ?? '') || 'litecoin MWEB output')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LitecoinMwebTransactionView from '$/views/LitecoinMwebTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.LitecoinMwebOutput}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/mweb/(litecoinMwebBlock)/transaction/[transactionIndex=nonNegativeInteger]/(litecoinMwebTransaction)/output/[outputIndex=nonNegativeInteger]',
				{
					network: (
						'caip2' in transaction.$mwebBlock.$block.$network ?
							caip2StringFromValue(transaction.$mwebBlock.$block.$network.caip2)
						:
							transaction.$mwebBlock.$block.$network.slug
					),
					blockNumber: String(transaction.$mwebBlock.$block.height),
					transactionIndex: String(transaction.transactionIndex),
					outputIndex: String(selection.entitySelector.outputIndex),
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
		<ResourceBoundary resource={litecoinMwebOutput}>
			{#snippet children(entity)}
				{(entity.commitment ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<NumberValue
			value={selection.entitySelector.outputIndex}
		/>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<LitecoinMwebTransactionView
						selection={select(EntityType.LitecoinMwebTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>output index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.outputIndex}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={litecoinMwebOutput}
			>
				{#snippet children(entity)}
					{@const commitment = entity.commitment}
					{#if commitment != null}
						<div>
							<dt>commitment</dt>
							<dd>
								{commitment}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							senderPubkey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const senderPubkey = entity.senderPubkey}
					{#if senderPubkey != null}
						<div>
							<dt>sender public key</dt>
							<dd>
								{senderPubkey}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
