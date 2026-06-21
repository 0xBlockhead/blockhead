<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { ComponentProps, Snippet } from 'svelte'
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
		href = resolve('/nostr'),
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.NostrNetwork>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		never
	> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.NostrNetwork}
	entitySelector={selection.entitySelector}
	href={href}
	bind:open
	{collapsible}
	{...EntityViewProps}
	title="Nostr"
>
	{#snippet Value()}
		Nostr
	{/snippet}

	{#snippet Title()}
		Nostr
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Relays propagate signed events over WebSocket (<code>wss://</code>). Profiles (kind 0), notes (kind 1), reposts (kind 6), and articles (kind 30023) load here via Constants seeds plus NostrBand and Primal HTTP indexers—not direct relay subscriptions.
		</p>
		<p>
			Reactions (kind 7) resolve on each note’s <code>$$reactions</code> field, not as a standalone network registry slice. Author pubkeys and event ids are 64-character lowercase hex.
		</p>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection( { sources: [
						Source.Constants_Internal,
					], fields: { protocolName: true, registryLabel: true, ...(open ? ({ homeUrl: true, docsUrl: true, topology: true }) : ({  })) } })}
				placeholderText="Loading Nostr hub directory…"
			>
			{#snippet children(network)}
				{#if network.registryLabel}
					<div>
						<dt>Registry</dt>
						<dd>{network.registryLabel}</dd>
					</div>
				{:else if network.protocolName}
					<div>
						<dt>Protocol</dt>
						<dd>{network.protocolName}</dd>
					</div>
				{/if}

				{#if open && network.homeUrl}
					<div>
						<dt>Home</dt>
						<dd>
							<a href={network.homeUrl}>{network.homeUrl}</a>
						</dd>
					</div>
				{/if}

				{#if open && network.docsUrl}
					<div>
						<dt>Docs</dt>
						<dd>
							<a href={network.docsUrl}>{network.docsUrl}</a>
						</dd>
					</div>
				{/if}

				{#if open && network.topology}
					<div>
						<dt>Topology</dt>
						<dd>{network.topology}</dd>
					</div>
				{/if}
			{/snippet}
		</ResourceBoundary>
	</dl>
	{/snippet}
</EntityView>
