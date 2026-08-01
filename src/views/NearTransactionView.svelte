<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.NearTransaction> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.NearRpc_JsonRpc,
			Source.NearBlocks_Rest,
		],
	}))
	const nearTransaction = $derived(viewSelection({
		fields: {
			signerAccountId: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NearActionsView from '$/views/NearActionsView.svelte'
	import NearExecutionOutcomesView from '$/views/NearExecutionOutcomesView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import NearAccountView from '$/views/NearAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.NearTransaction}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.hash || 'near transaction')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={selection.entitySelector.hash} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={nearTransaction}>
			{#snippet children(entity)}
				<ResourceBoundary
					resource={selection.$signer}
				>
					{#snippet children(nearAccount)}
						{#if nearAccount != null}
							<NearAccountView
								selection={select(EntityType.NearAccount, nearAccount[EntityMetaKey.Selector])}
								prefetched={nearAccount}
								layout={EntityLayout.Value}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<TruncatedValue value={entity.signerAccountId} />
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$receiver}
		>
			{#snippet children(nearAccount)}
				{#if nearAccount != null}
					<span data-text="muted">
						<NearAccountView
							selection={select(EntityType.NearAccount, nearAccount[EntityMetaKey.Selector])}
							prefetched={nearAccount}
							layout={EntityLayout.Title}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.hash} />
				</dd>
			</div>

			<div>
				<dt>Signer account ID</dt>
				<dd>
					<ResourceBoundary
						resource={nearTransaction}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.signerAccountId} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$signer}
			>
				{#snippet children(nearAccount)}
					{#if nearAccount != null}
						<div>
							<dt>Signer</dt>
							<dd>
								<NearAccountView
									selection={select(EntityType.NearAccount, nearAccount[EntityMetaKey.Selector])}
									prefetched={nearAccount}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$receiver}
			>
				{#snippet children(nearAccount)}
					{#if nearAccount != null}
						<div>
							<dt>Receiver</dt>
							<dd>
								<NearAccountView
									selection={select(EntityType.NearAccount, nearAccount[EntityMetaKey.Selector])}
									prefetched={nearAccount}
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
							nonce: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nonce = entity.nonce}
					{#if nonce != null}
						<div>
							<dt>Nonce</dt>
							<dd>
								<NumberValue
									value={nonce}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const actionsResource = selection.$$actions}
		<ResourceBoundary
			resource={actionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<NearActionsView
						selection={actionsResource}
						countResource={actionsResource.count}
						title='Actions'
						id='actions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const executionOutcomesResource = selection.$$executionOutcomes}
		<ResourceBoundary
			resource={executionOutcomesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<NearExecutionOutcomesView
						selection={executionOutcomesResource}
						countResource={executionOutcomesResource.count}
						title='Execution outcomes'
						id='execution-outcomes'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
