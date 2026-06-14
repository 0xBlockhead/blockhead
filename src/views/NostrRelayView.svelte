<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve(
			'/(social)/(nostr)/nostr/relay/[relayKey]',
			{ relayKey: encodeURIComponent(selector.relayUrl) },
		),
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.NostrRelay>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

	const relay = subscribe(EntityType.NostrRelay,
		selector,
		({ sources: [
				Source.NostrBand_Rest,
			], fields: { name: true, description: true, software: true, version: true, supportedNipCount: true, isPaid: true } }),
	)


	// (Derived)
	const relayRow = $derived(
		relay.ready ? relay.current : undefined,
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.NostrRelay}
	entitySelector={selector}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={selector.relayUrl}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={relay}
			placeholderText="Loading relay…"
		>
			{#snippet children(relay)}
				{#if relay.fields.name}
					{relay.fields.name}
				{:else}
					{#if Value}
					{@render Value()}
				{/if}
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
				{#if open && relay.fields.description}
					<p>
						<TruncatedValue
							value={relay.fields.description}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<dl data-column-item="center">
				{#if (
				open
				&& relayRow?.software
			)}
				<div>
					<dt>Software</dt>
					<dd>
						<ResourceBoundary
							resource={relay}
							placeholderText="Loading relay…"
						>
							{#snippet children(relay)}
								{relay.fields.software}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& relayRow?.version
			)}
				<div>
					<dt>Version</dt>
					<dd>
						<ResourceBoundary
							resource={relay}
							placeholderText="Loading relay…"
						>
							{#snippet children(relay)}
								{relay.fields.version}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& relayRow?.supportedNipCount != null
			)}
				<div>
					<dt>Supported NIPs</dt>
					<dd>
						<ResourceBoundary
							resource={relay}
							placeholderText="Loading relay…"
						>
							{#snippet children(relay)}
								{String(relay.fields.supportedNipCount)}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& relayRow?.isPaid != null
			)}
				<div>
					<dt>Paid relay</dt>
					<dd>
						<ResourceBoundary
							resource={relay}
							placeholderText="Loading relay…"
						>
							{#snippet children(relay)}
								{relay.fields.isPaid ? 'Yes' : 'No'}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& relayRow?.limit != null
			)}
				<div>
					<dt>Event limit</dt>
					<dd>
						<ResourceBoundary
							resource={relay}
							placeholderText="Loading relay…"
						>
							{#snippet children(relay)}
								{String(relay.fields.limit)}
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
