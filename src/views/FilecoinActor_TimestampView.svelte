<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.FilecoinActor_Timestamp> = $props()

	const actor = $derived(selection.entitySelector.$actor)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Lotus_JsonRpc,
			Source.Filfox_Rest,
		],
	}))
	const filecoinActorTimestamp = $derived(viewSelection({
		fields: {
			timestampMs: true,
			balanceAttoFil: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FilecoinActorView from '$/views/FilecoinActorView.svelte'
	import FilecoinTipsetView from '$/views/FilecoinTipsetView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinActor_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? (String(prefetched.timestampMs ?? '') || 'filecoin actor timestamp')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/actor/[address=stringSegment]/(filecoinActor)/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]',
				{
					network: (
						'caip2' in actor.$network ?
							caip2StringFromValue(actor.$network.caip2)
						:
							actor.$network.slug
					),
					address: actor.address,
					height: String(selection.entitySelector.height),
					tipsetKey: selection.entitySelector.tipsetKey,
					source: selection.entitySelector.source,
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
		<ResourceBoundary resource={filecoinActorTimestamp}>
			{#snippet children(entity)}
				<Timestamp timestamp={entity.timestampMs} />
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={filecoinActorTimestamp}>
			{#snippet children(entity)}
				{@const balanceAttoFil = entity.balanceAttoFil}
				{#if balanceAttoFil != null}
					<NumberValue
						value={balanceAttoFil}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NumberValue
				value={selection.entitySelector.height}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Actor</dt>
				<dd>
					<FilecoinActorView
						selection={select(EntityType.FilecoinActor, selection.entitySelector.$actor)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={filecoinActorTimestamp}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.timestampMs} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<div>
				<dt>Height</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.height}
					/>
				</dd>
			</div>

			<div>
				<dt>Tipset key</dt>
				<dd>
					{selection.entitySelector.tipsetKey}
				</dd>
			</div>

			<div>
				<dt>Tipset</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$tipset}
					>
						{#snippet children(filecoinTipset)}
							<FilecoinTipsetView
								selection={select(EntityType.FilecoinTipset, filecoinTipset[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							idAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const idAddress = entity.idAddress}
					{#if idAddress != null}
						<div>
							<dt>ID address</dt>
							<dd>
								<TruncatedValue value={idAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							actorCodeCid: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const actorCodeCid = entity.actorCodeCid}
					{#if actorCodeCid != null}
						<div>
							<dt>Actor code CID</dt>
							<dd>
								{actorCodeCid}
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

			<ResourceBoundary
				resource={filecoinActorTimestamp}
			>
				{#snippet children(entity)}
					{@const balanceAttoFil = entity.balanceAttoFil}
					{#if balanceAttoFil != null}
						<div>
							<dt>Balance attoFIL</dt>
							<dd>
								<NumberValue
									value={balanceAttoFil}
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
							stateRootCid: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const stateRootCid = entity.stateRootCid}
					{#if stateRootCid != null}
						<div>
							<dt>State root CID</dt>
							<dd>
								{stateRootCid}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
