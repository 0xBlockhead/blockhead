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
	}: EntitySelectionViewProps<EntityType.LensAccountManager> = $props()

	const lensAccountManager = $derived(selection({
		fields: {
			isLensManager: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import LensAccountView from '$/views/LensAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.LensAccountManager}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.manager || 'Lens account manager')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={selection.entitySelector.manager} />
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.manager} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={lensAccountManager}>
			{#snippet children(entity)}
				{@const isLensManager = entity.isLensManager}
				{#if isLensManager != null}
					<span data-text="muted">
						{isLensManager ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Manager</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.manager} />
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							addedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const addedAt = entity.addedAt}
					{#if addedAt != null}
						<div>
							<dt>Added at</dt>
							<dd>
								<Timestamp timestamp={addedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={lensAccountManager}
			>
				{#snippet children(entity)}
					{@const isLensManager = entity.isLensManager}
					{#if isLensManager != null}
						<div>
							<dt>Is Lens manager</dt>
							<dd>
								{isLensManager ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							canExecuteTransactions: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const canExecuteTransactions = entity.canExecuteTransactions}
					{#if canExecuteTransactions != null}
						<div>
							<dt>Can execute transactions</dt>
							<dd>
								{canExecuteTransactions ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							canSetMetadataUri: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const canSetMetadataUri = entity.canSetMetadataUri}
					{#if canSetMetadataUri != null}
						<div>
							<dt>Can set metadata URI</dt>
							<dd>
								{canSetMetadataUri ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							canTransferNative: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const canTransferNative = entity.canTransferNative}
					{#if canTransferNative != null}
						<div>
							<dt>Can transfer native</dt>
							<dd>
								{canTransferNative ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							canTransferTokens: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const canTransferTokens = entity.canTransferTokens}
					{#if canTransferTokens != null}
						<div>
							<dt>Can transfer tokens</dt>
							<dd>
								{canTransferTokens ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Account</dt>
				<dd>
					<LensAccountView
						selection={select(EntityType.LensAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
