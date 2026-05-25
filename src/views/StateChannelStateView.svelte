<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/channels'),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		showParentChannel = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.StateChannelState>
			href?: string
			layout?: EntityLayout
			open?: boolean
			showParentChannel?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const state = useEntity(
		EntityType.StateChannelState,
		entityId,
		{
			$: [Source.Local_Internal],
			intent: {},
			version: {},
			isFinal: {},
			timestamp: {},
			stateData: {},
			$channel: {},
			...(open && {
				allocations: {},
				signatures: {},
			}),
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
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
				{#snippet children(loadedState)}
					{#if loadedState.version !== undefined}
						<span>v{String(state.version)}</span>
					{:else}
						{@render Value()}
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
				{#snippet children(loadedState)}
					{#if showParentChannel && loadedState.$channel?.[EntityMetaKey.Id].id !== undefined}
						<div>
							<dt>Channel</dt>
							<dd>
								<a
									href={resolve('/(assets)/(channels)/channel/[channelId]', {
										channelId: loadedState.$channel[EntityMetaKey.Id].id,
									})}
								>
									{loadedState.$channel[EntityMetaKey.Id].id}
								</a>
							</dd>
						</div>
					{/if}

					{#if loadedState.version !== undefined}
						<div>
							<dt>Version</dt>
							<dd>{String(state.version)}</dd>
						</div>
					{/if}

					{#if loadedState.intent !== undefined}
						<div>
							<dt>Intent</dt>
							<dd>{String(state.intent)}</dd>
						</div>
					{/if}

					{#if loadedState.isFinal !== undefined}
						<div>
							<dt>Final</dt>
							<dd>{loadedState.isFinal ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if loadedState.timestamp !== undefined}
						<div>
							<dt>Recorded at</dt>
							<dd>
								<Timestamp
									timestamp={loadedState.timestamp}
								/>
							</dd>
						</div>
					{/if}

					{#if loadedState.stateData !== undefined}
						<div>
							<dt>State data</dt>
							<dd>
								<TruncatedValue
									value={loadedState.stateData}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && state.allocations !== undefined}
						<div>
							<dt>Allocations</dt>
							<dd>{String(state.allocations.length)}</dd>
						</div>
					{/if}

					{#if open && state.signatures !== undefined}
						<div>
							<dt>Signatures</dt>
							<dd>{String(state.signatures.length)}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: _detailsOpen })}
		<EntityDetails
			entityType={EntityType.StateChannelState}
			{entityId}
		/>
	{/snippet}
</EntityView>
