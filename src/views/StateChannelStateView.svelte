<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/channels'),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		collapsible = true,
		showParentChannel = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.StateChannelState>
			href?: string
			layout?: EntityLayout
			open?: boolean
			collapsible?: boolean
			showParentChannel?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const state = useEntity(entityCollectionsContext, EntityType.StateChannelState,
		entityId,
		({ sources: [Source.Local_Internal], fields: { intent: true, version: true, isFinal: true, timestamp: true, stateData: true, $channel: true, ...(open && ({ allocations: true, signatures: true })) } }),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.StateChannelState}
	{entityId}
	href={href}
	{layout}
	bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>State </span>
			<ResourceBoundary
				resource={state}
				placeholderText="…"
			>
				{#snippet children(state)}
					{#if state.fields.version !== undefined}
						<span>v{String(state.fields.version)}</span>
					{:else}
						{#if Value}
						{@render Value()}
					{/if}
					{/if}
				{/snippet}
			</ResourceBoundary>
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Signed channel snapshot with allocation vector and co-signatures for a Nitro-style update.
		</p>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={state}
				placeholderText="Loading channel state…"
			>
				{#snippet children(state)}
					{#if showParentChannel && state.fields.$channel?.[EntityMetaKey.Id].id !== undefined}
						<div>
							<dt>Channel</dt>
							<dd>
								<a
									href={resolve('/(assets)/(channels)/channel/[channelId]', {
										channelId: state.fields.$channel[EntityMetaKey.Id].id,
									})}
								>
									{state.fields.$channel[EntityMetaKey.Id].id}
								</a>
							</dd>
						</div>
					{/if}

					{#if state.fields.version !== undefined}
						<div>
							<dt>Version</dt>
							<dd>{String(state.fields.version)}</dd>
						</div>
					{/if}

					{#if state.fields.intent !== undefined}
						<div>
							<dt>Intent</dt>
							<dd>{String(state.fields.intent)}</dd>
						</div>
					{/if}

					{#if state.fields.isFinal !== undefined}
						<div>
							<dt>Final</dt>
							<dd>{state.fields.isFinal ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if state.fields.timestamp !== undefined}
						<div>
							<dt>Recorded at</dt>
							<dd>
								<Timestamp
									timestamp={state.fields.timestamp}
								/>
							</dd>
						</div>
					{/if}

					{#if state.fields.stateData !== undefined}
						<div>
							<dt>State data</dt>
							<dd>
								<TruncatedValue
									value={state.fields.stateData}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && state.fields.allocations !== undefined}
						<div>
							<dt>Allocations</dt>
							<dd>{String(state.fields.allocations.length)}</dd>
						</div>
					{/if}

					{#if open && state.fields.signatures !== undefined}
						<div>
							<dt>Signatures</dt>
							<dd>{String(state.fields.signatures.length)}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
