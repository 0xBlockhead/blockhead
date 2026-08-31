<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.TallyProposalExecutableCall>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TallyProposalView from '$/views/TallyProposalView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.TallyProposalExecutableCall}
	entitySelector={selection.entitySelector}
	title={title ?? 'Call #' + String(selection.entitySelector.index)}
	href={
		href === undefined ?
			resolve(
				'/~/tally/proposal/[proposalId=stringSegment]/(tallyProposal)/executable-call/[index=nonNegativeInteger]',
				{
					proposalId: encodeURIComponent(selection.entitySelector.$proposal.proposalId),
					index: String(selection.entitySelector.index),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet HeadingAfter()}
		<span data-text="muted">
			<TallyProposalView
				selection={select(EntityType.TallyProposal, selection.entitySelector.$proposal)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Proposal</dt>
				<dd>
					<TallyProposalView
						selection={select(EntityType.TallyProposal, selection.entitySelector.$proposal)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Call index</dt>
				<dd>
					{selection.entitySelector.index}
				</dd>
			</div>

			<div>
				<dt>Network</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$network}
					>
						{#snippet children(network)}
							{@const networkInitial = untrack(() => network)}
							<NetworkView
								selection={select(EntityType.Network, (network ?? networkInitial)[EntityMetaKey.Selector])}
								prefetched={network ?? networkInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Target</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$target}
					>
						{#snippet children(evmNetworkAccount)}
							<EvmNetworkAccountView
								selection={select(EntityType.EvmNetworkAccount, evmNetworkAccount[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Value</dt>
				<dd>
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
							{entity.value}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							callType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const callType = entity.callType}
					{#if callType != null}
						<div>
							<dt>Call type</dt>
							<dd>
								{callType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							signature: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const signature = entity.signature}
					{#if signature != null}
						<div>
							<dt>Signature</dt>
							<dd>
								<TruncatedValue value={signature} />
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
						calldata: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const calldata = entity.calldata}
				{#if calldata !== ''}
					<p data-text="long-text">{calldata}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
