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
	}: EntitySelectionViewProps<EntityType.QuilibriumShard> = $props()

	const quilibriumShard = $derived(selection({
		sources: selection.sources ?? [
			Source.QuilibriumNode_Grpc,
		],
	})({
		fields: {
			shardKind: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import QuilibriumFramesView from '$/views/QuilibriumFramesView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import QuilibriumAccountView from '$/views/QuilibriumAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.QuilibriumShard}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.shardKey || 'quilibrium shard')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={quilibriumShard}>
			{#snippet children(entity)}
				{@const shardKind = entity.shardKind}
				{#if shardKind != null}
					<span data-text="muted">
						{shardKind}
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
					/>
				</dd>
			</div>

			<div>
				<dt>shard key</dt>
				<dd>
					{selection.entitySelector.shardKey}
				</dd>
			</div>

			<ResourceBoundary
				resource={quilibriumShard}
			>
				{#snippet children(entity)}
					{@const shardKind = entity.shardKind}
					{#if shardKind != null}
						<div>
							<dt>shard kind</dt>
							<dd>
								{shardKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$applicationAccount}
			>
				{#snippet children(quilibriumAccount)}
					{#if quilibriumAccount != null}
						<div>
							<dt>application account</dt>
							<dd>
								<QuilibriumAccountView
									selection={select(EntityType.QuilibriumAccount, quilibriumAccount[EntityMetaKey.Selector])}
									prefetched={quilibriumAccount}
									layout={EntityLayout.Value}
								/>
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
