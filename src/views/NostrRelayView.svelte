<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve(
			'/(social)/(nostr)/nostr/relay/[relayKey]',
			{ relayKey: encodeURIComponent(selection.entitySelector.relayUrl) },
		),
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.NostrRelay>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	const relay = $derived(selection( { sources: [
				Source.Constants_Internal,
			], fields: { name: true, description: true, software: true, version: true, supportedNipCount: true, isPaid: true } }))

	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.NostrRelay}
	entitySelector={selection.entitySelector}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={selection.entitySelector.relayUrl}
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
			<ResourceBoundary
				resource={relay}
				placeholderText="Loading relay…"
			>
				{#snippet children(relay)}
					{#if open && relay.software}
						<div>
							<dt>Software</dt>
							<dd>
								{relay.software}
							</dd>
						</div>
					{/if}

					{#if open && relay.version}
						<div>
							<dt>Version</dt>
							<dd>
								{relay.version}
							</dd>
						</div>
					{/if}

					{#if open && relay.supportedNipCount != null}
						<div>
							<dt>Supported NIPs</dt>
							<dd>
								{String(relay.supportedNipCount)}
							</dd>
						</div>
					{/if}

					{#if open && relay.isPaid != null}
						<div>
							<dt>Paid relay</dt>
							<dd>
								{relay.isPaid ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}

					{#if open && relay.limit != null}
						<div>
							<dt>Event limit</dt>
							<dd>
								{String(relay.limit)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

</EntityView>
