<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Props
	let {
		entityId,
		href,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.NostrRelay>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'Icon'
			| 'Content'
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
			nip11Name: {},
			nip11Description: {},
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
	{href}
	bind:open
	{...entityViewRest}
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
					<TruncatedValue
						value={entityId.relayUrl}
						format={TruncatedValueFormat.Visual}
					/>
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

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			{#if open}
				{#if relay.description}
					<div>
						<dt>Description</dt>
						<dd>
							<ResourceBoundary
								resource={relay}
								placeholderText="Loading relay…"
							>
								{#snippet children(relay)}
									{relay.description}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
			{/if}

			{#if open}
				{#if relay.software}
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
			{/if}

			{#if open}
				{#if relay.version}
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
			{/if}

			{#if open}
				{#if relay.supportedNipCount != null}
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
			{/if}

			{#if open}
				{#if relay.isPaid != null}
					<div>
						<dt>Paid relay</dt>
						<dd>
							<ResourceBoundary
								resource={relay}
								placeholderText="Loading relay…"
							>
								{#snippet children(relay)}
									{String(relay.isPaid)}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
			{/if}

			{#if open}
				{#if relay.limit != null}
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
			{/if}
		</dl>
{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.NostrRelay}
			{entityId}
		/>
	{/snippet}
</EntityView>
