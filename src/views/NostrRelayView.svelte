<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(social)/(nostr)/nostr/relay/[relayKey]',
			{ relayKey: encodeURIComponent(entityId.relayUrl) },
		),
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.NostrRelay>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const relay = useEntity(
		EntityType.NostrRelay,
		entityId,
		{
			$: [
				Source.NostrBand_Rest,
			],
			name: {},
			description: {},
			software: {},
			version: {},
			supportedNipCount: {},
			isPaid: {},
			limit: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.NostrRelay}
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={entityId.relayUrl}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={relay}
			placeholderText="Loading relay…"
		>
			{#snippet children(relay)}
				{#if relay.name}
					{relay.name}
				{:else}
					{@render Value()}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Relays propagate signed Nostr events over WebSocket; relay ids are normalized <code>wss://</code> URLs.
		</p>
		<p>
			NIP-11 metadata may expose name, description, relay software, version, and supported NIP counts when available from NostrBand.
		</p>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			resource={relay}
			placeholderText="Loading relay…"
		>
			{#snippet children(relay)}
				{#if open && relay.description}
					<p>
						<TruncatedValue
							value={relay.description}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<dl data-column-item="center">
				{#if (
				open
				&& relay.software
			)}
				<div>
					<dt>Software</dt>
					<dd>
						<ResourceBoundary
							resource={relay}
							placeholderText="Loading relay…"
						>
							{#snippet children(relay)}
								{relay.software}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& relay.version
			)}
				<div>
					<dt>Version</dt>
					<dd>
						<ResourceBoundary
							resource={relay}
							placeholderText="Loading relay…"
						>
							{#snippet children(relay)}
								{relay.version}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& relay.supportedNipCount != null
			)}
				<div>
					<dt>Supported NIPs</dt>
					<dd>
						<ResourceBoundary
							resource={relay}
							placeholderText="Loading relay…"
						>
							{#snippet children(relay)}
								{String(relay.supportedNipCount)}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& relay.isPaid != null
			)}
				<div>
					<dt>Paid relay</dt>
					<dd>
						<ResourceBoundary
							resource={relay}
							placeholderText="Loading relay…"
						>
							{#snippet children(relay)}
								{relay.isPaid ? 'Yes' : 'No'}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& relay.limit != null
			)}
				<div>
					<dt>Event limit</dt>
					<dd>
						<ResourceBoundary
							resource={relay}
							placeholderText="Loading relay…"
						>
							{#snippet children(relay)}
								{String(relay.limit)}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
	{/snippet}
</EntityView>
