<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: EntitySelectionViewProps<EntityType.NearReceipt> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import NearAccountView from '$/views/NearAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.NearReceipt}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.receiptId || 'near receipt')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={selection.entitySelector.receiptId} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$receiver}
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
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$predecessor}
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

	{#snippet Content()}
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
				<dt>Receipt ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.receiptId} />
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$predecessor}
			>
				{#snippet children(nearAccount)}
					{#if nearAccount != null}
						<div>
							<dt>Predecessor</dt>
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
		</dl>
	{/snippet}
</EntityView>
