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
	}: EntitySelectionViewProps<EntityType.QuilibriumProver> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.QuilibriumNode_Grpc,
		],
	}))
	const quilibriumProver = $derived(viewSelection({
		fields: {
			version: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import QuilibriumFramesView from '$/views/QuilibriumFramesView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.QuilibriumProver}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.proverPeerId || 'quilibrium prover')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{selection.entitySelector.proverPeerId || 'quilibrium prover'}
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
		<ResourceBoundary resource={quilibriumProver}>
			{#snippet children(entity)}
				{@const version = entity.version}
				{#if version != null}
					<span data-text="muted">
						{version}
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
				<dt>prover peer ID</dt>
				<dd>
					{selection.entitySelector.proverPeerId}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							publicKey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const publicKey = entity.publicKey}
					{#if publicKey != null}
						<div>
							<dt>public key</dt>
							<dd>
								{publicKey}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={quilibriumProver}
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
							lastSeenAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastSeenAt = entity.lastSeenAt}
					{#if lastSeenAt != null}
						<div>
							<dt>last seen AT</dt>
							<dd>
								<Timestamp timestamp={lastSeenAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const framesResource = selection.$$frames}
		<ResourceBoundary
			resource={framesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<QuilibriumFramesView
						selection={framesResource}
						countResource={framesResource.count}
						title='frames'
						id='frames'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
