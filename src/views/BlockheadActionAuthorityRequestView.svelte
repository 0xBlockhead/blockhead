<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadActionAuthorityRequest>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadActionAuthorityRequest = $derived(viewSelection({
		fields: {
			presentedAt: true,
			decision: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.id || 'authority request')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadSessionActionsView from '$/views/BlockheadSessionActionsView.svelte'
	import BlockheadActionDispatchOccurrencesView from '$/views/BlockheadActionDispatchOccurrencesView.svelte'
	import BlockheadWalletConnectionView from '$/views/BlockheadWalletConnectionView.svelte'
	import AccountView from '$/views/AccountView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadActionAuthorityRequest}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={blockheadActionAuthorityRequest}>
			{#snippet children(entity)}
				{(entity.decision ?? '') || selection.entitySelector.id || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadActionAuthorityRequest}>
			{#snippet children(entity)}
				<span data-text="muted">
					<Timestamp timestamp={entity.presentedAt} />
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>id</dt>
				<dd>
					{selection.entitySelector.id}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$walletConnection}
			>
				{#snippet children(blockheadWalletConnection)}
					{#if blockheadWalletConnection != null}
						<div>
							<dt>wallet connection</dt>
							<dd>
								<BlockheadWalletConnectionView
									selection={select(EntityType.BlockheadWalletConnection, blockheadWalletConnection[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$account}
			>
				{#snippet children(account)}
					{#if account != null}
						<div>
							<dt>account</dt>
							<dd>
								<AccountView
									selection={select(EntityType.Account, account[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadActionAuthorityRequest}
			>
				{#snippet children(entity)}
					{@const decision = entity.decision}
					{#if decision != null}
						<div>
							<dt>decision</dt>
							<dd>
								{decision}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>action revision bindings</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									actionRevisionBindings: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.actionRevisionBindings.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>envelope</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									envelope: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.envelope}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>envelope hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									envelopeHash: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.envelopeHash} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>presented at</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadActionAuthorityRequest}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.presentedAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const sessionActionsResource = selection.$$sessionActions}
		<ResourceBoundary
			resource={sessionActionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadSessionActionsView
						selection={sessionActionsResource}
						countResource={sessionActionsResource.count}
						title='session actions'
						id='session-actions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const dispatchOccurrencesResource = selection.$$dispatchOccurrences}
		<ResourceBoundary
			resource={dispatchOccurrencesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadActionDispatchOccurrencesView
						selection={dispatchOccurrencesResource}
						countResource={dispatchOccurrencesResource.count}
						title='dispatch occurrences'
						id='dispatch-occurrences'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
