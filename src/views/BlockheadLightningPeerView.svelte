<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadLightningPeer>, 'prefetched'> = $props()

	const localNodeState = $derived(selection.entitySelector.$localNodeState)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadLightningPeer_TimestampsView from '$/views/BlockheadLightningPeer_TimestampsView.svelte'
	import BlockheadLightningNodeStateView from '$/views/BlockheadLightningNodeStateView.svelte'
	import LightningNodeView from '$/views/LightningNodeView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLightningPeer}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.publicKey || 'local LND peer')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/~/lightning/connection/[connectionId=stringSegment]/node-state/(blockheadLightningNodeState)/peer/[publicKey=stringSegment]',
				{
					network: (
						'caip2' in localNodeState.$network.$network ?
							caip2StringFromValue(localNodeState.$network.$network.caip2)
						:
							localNodeState.$network.$network.slug
					),
					connectionId: localNodeState.connectionId,
					publicKey: selection.entitySelector.publicKey,
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
		<TruncatedValue value={selection.entitySelector.publicKey} />
	{/snippet}

	{#snippet Value()}
		<BlockheadLightningNodeStateView
			selection={select(EntityType.BlockheadLightningNodeState, selection.entitySelector.$localNodeState)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$node}
		>
			{#snippet children(lightningNode)}
				{#if lightningNode != null}
					{@const lightningNodeInitial = untrack(() => lightningNode)}
					<span data-text="muted">
						<LightningNodeView
							selection={select(EntityType.LightningNode, (lightningNode ?? lightningNodeInitial)[EntityMetaKey.Selector])}
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
				<dt>local LND node state</dt>
				<dd>
					<BlockheadLightningNodeStateView
						selection={select(EntityType.BlockheadLightningNodeState, selection.entitySelector.$localNodeState)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>remote public key</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.publicKey} />
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$node}
			>
				{#snippet children(lightningNode)}
					{#if lightningNode != null}
						{@const lightningNodeInitial = untrack(() => lightningNode)}
						<div>
							<dt>public graph node</dt>
							<dd>
								<LightningNodeView
									selection={select(EntityType.LightningNode, (lightningNode ?? lightningNodeInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadLightningPeer_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
