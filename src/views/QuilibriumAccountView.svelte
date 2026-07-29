<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.QuilibriumAccount> = $props()

	const quilibriumAccount = $derived(selection({
		sources: selection.sources ?? [
			Source.QuilibriumNode_Grpc,
		],
	})({
		fields: {
			accountKind: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadQuilibriumAccountStatesView from '$/views/BlockheadQuilibriumAccountStatesView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.QuilibriumAccount}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.accountAddress || 'quilibrium account')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{selection.entitySelector.accountAddress || 'quilibrium account'}
	{/snippet}

	{#snippet Value()}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href={null}
			layout={EntityLayout.Value}
			open={false}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={quilibriumAccount}>
			{#snippet children(entity)}
				{@const accountKind = entity.accountKind}
				{#if accountKind != null}
					<span data-text="muted">
						{accountKind}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>account address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.accountAddress} />
				</dd>
			</div>

			<ResourceBoundary
				resource={quilibriumAccount}
			>
				{#snippet children(entity)}
					{@const accountKind = entity.accountKind}
					{#if accountKind != null}
						<div>
							<dt>account kind</dt>
							<dd>
								{accountKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const blockheadAccountStatesResource = selection.$$blockheadAccountStates}
		<ResourceBoundary
			resource={blockheadAccountStatesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadQuilibriumAccountStatesView
						selection={blockheadAccountStatesResource}
						countResource={blockheadAccountStatesResource.count}
						title='blockhead account states'
						id='blockhead-account-states'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
