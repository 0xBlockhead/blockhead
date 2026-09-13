<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.StarknetTransaction>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Juno_JsonRpc,
			Source.Pathfinder,
			Source.Starkscan,
			Source.Voyager,
		],
	}))
	const starknetTransaction = $derived(viewSelection({
		fields: {
			transactionKind: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.transactionHash || 'starknet transaction')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import StarknetEventsView from '$/views/StarknetEventsView.svelte'
	import StarknetTransaction_TimestampsView from '$/views/StarknetTransaction_TimestampsView.svelte'
	import StarknetBlockView from '$/views/StarknetBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.StarknetTransaction}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/transaction/starknet/[transactionHash=stringSegment]',
				{
					network: (
						selection.entitySelector.$network.$network.caip2 !== undefined ?
							caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
						:
							selection.entitySelector.$network.$network.slug
					),
					transactionHash: selection.entitySelector.transactionHash,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={starknetTransaction}>
			{#snippet children(entity)}
				{(entity.transactionKind ?? '') || selection.entitySelector.transactionHash || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$block}
		>
			{#snippet children(starknetBlock)}
				{#if starknetBlock != null}
					{@const starknetBlockInitial = untrack(() => starknetBlock)}
					<span data-text="muted">
						<StarknetBlockView
							selection={select(EntityType.StarknetBlock, (starknetBlock ?? starknetBlockInitial)[EntityMetaKey.Selector])}
							prefetched={starknetBlock ?? starknetBlockInitial}
							layout={EntityLayout.Title}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>transaction hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.transactionHash} />
				</dd>
			</div>

			<ResourceBoundary
				resource={starknetTransaction}
			>
				{#snippet children(entity)}
					{@const transactionKind = entity.transactionKind}
					{#if transactionKind != null}
						<div>
							<dt>transaction kind</dt>
							<dd>
								{transactionKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet children(starknetBlock)}
					{#if starknetBlock != null}
						{@const starknetBlockInitial = untrack(() => starknetBlock)}
						<div>
							<dt>block</dt>
							<dd>
								<StarknetBlockView
									selection={select(EntityType.StarknetBlock, (starknetBlock ?? starknetBlockInitial)[EntityMetaKey.Selector])}
									prefetched={starknetBlock ?? starknetBlockInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							senderAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const senderAddress = entity.senderAddress}
					{#if senderAddress != null}
						<div>
							<dt>sender address</dt>
							<dd>
								<TruncatedValue value={senderAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							nonce: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nonce = entity.nonce}
					{#if nonce != null}
						<div>
							<dt>nonce</dt>
							<dd>
								{nonce}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							version: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const version = entity.version}
					{#if version != null}
						<div>
							<dt>version</dt>
							<dd>
								{version}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							resourceBounds: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resourceBounds = entity.resourceBounds}
					{#if resourceBounds != null}
						<div>
							<dt>resource bounds</dt>
							<dd>
								{resourceBounds}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>calldata</dt>
				<dd>
					<ResourceBoundary
						resource={viewSelection.calldata}
					>
						{#snippet children(calldata)}
							{calldata.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>signature</dt>
				<dd>
					<ResourceBoundary
						resource={viewSelection.signature}
					>
						{#snippet children(signature)}
							<TruncatedValue value={signature.values.join(', ')} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const eventsResource = selection.$$events}
		<ResourceBoundary
			resource={eventsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<StarknetEventsView
						selection={eventsResource}
						countResource={eventsResource.count}
						title='events'
						id='events'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<StarknetTransaction_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
