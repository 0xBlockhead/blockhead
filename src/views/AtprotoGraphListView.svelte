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
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.AtprotoGraphList> = $props()

	const atprotoGraphList = $derived(selection({
		sources: selection.sources ?? [
			Source.Atproto_Xrpc,
			Source.Atproto_BskySocial_Xrpc,
		],
		fields: {
			name: true,
			cid: true,
			purpose: true,
			listItemCount: true,
			indexedAt: true,
		},
	}))
	const titleFallback = $derived((prefetched.name ?? '') || 'AT Protocol graph list')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AtprotoActorView from '$/views/AtprotoActorView.svelte'
</script>


<EntityView
	entityType={EntityType.AtprotoGraphList}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/graph-list/[...uri=stringSegment]',
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
		<ResourceBoundary resource={atprotoGraphList}>
			{#snippet children(entity)}
				{entity.name || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
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

			<div>
				<dt>Purpose</dt>
				<dd>
					<ResourceBoundary
						resource={atprotoGraphList}
					>
						{#snippet children(entity)}
							{entity.purpose}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>CID</dt>
				<dd>
					<ResourceBoundary
						resource={atprotoGraphList}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.cid} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={atprotoGraphList}
			>
				{#snippet children(entity)}
					{@const listItemCount = entity.listItemCount}
					{#if listItemCount != null}
						<div>
							<dt>Members</dt>
							<dd>
								<NumberValue
									value={listItemCount}
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
						resource={atprotoGraphList}
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
