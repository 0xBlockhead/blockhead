<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.AtprotoStarterPack>, 'prefetched'> = $props()

	const atprotoStarterPack = $derived(selection({
		sources: selection.sources ?? [
			Source.Atproto_Xrpc,
			Source.Atproto_BskySocial_Xrpc,
		],
		fields: {
			cid: true,
			joinedWeekCount: true,
			joinedAllTimeCount: true,
			indexedAt: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AtprotoActorView from '$/views/AtprotoActorView.svelte'
	import AtprotoGraphListView from '$/views/AtprotoGraphListView.svelte'
</script>


<EntityView
	entityType={EntityType.AtprotoStarterPack}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.uri || 'AT Protocol starter pack')}
	href={
		href === undefined ?
			resolve(
				'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/starter-pack/[...uri=stringSegment]',
				{
					uri: encodeURIComponent(selection.entitySelector.uri),
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
		<TruncatedValue value={selection.entitySelector.uri} />
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>AT URI</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.uri} />
				</dd>
			</div>

			<div>
				<dt>Creator</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$creator}
					>
						{#snippet children(atprotoActor)}
							{@const atprotoActorInitial = untrack(() => atprotoActor)}
							<AtprotoActorView
								selection={select(EntityType.AtprotoActor, (atprotoActor ?? atprotoActorInitial)[EntityMetaKey.Selector])}
								prefetched={atprotoActor ?? atprotoActorInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$list}
			>
				{#snippet children(atprotoGraphList)}
					{#if atprotoGraphList != null}
						{@const atprotoGraphListInitial = untrack(() => atprotoGraphList)}
						<div>
							<dt>List</dt>
							<dd>
								<AtprotoGraphListView
									selection={select(EntityType.AtprotoGraphList, (atprotoGraphList ?? atprotoGraphListInitial)[EntityMetaKey.Selector])}
									prefetched={atprotoGraphList ?? atprotoGraphListInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>CID</dt>
				<dd>
					<ResourceBoundary
						resource={atprotoStarterPack}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.cid} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={atprotoStarterPack}
			>
				{#snippet children(entity)}
					{@const joinedWeekCount = entity.joinedWeekCount}
					{#if joinedWeekCount != null}
						<div>
							<dt>Joined this week</dt>
							<dd>
								<NumberValue
									value={joinedWeekCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={atprotoStarterPack}
			>
				{#snippet children(entity)}
					{@const joinedAllTimeCount = entity.joinedAllTimeCount}
					{#if joinedAllTimeCount != null}
						<div>
							<dt>Joined all time</dt>
							<dd>
								<NumberValue
									value={joinedAllTimeCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Indexed</dt>
				<dd>
					<ResourceBoundary
						resource={atprotoStarterPack}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.indexedAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
