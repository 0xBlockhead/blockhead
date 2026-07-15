<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'XMTP',
		typeAnnotationParagraphs = ['XMTP transports encrypted payloads between inbox identities. This hub shows local conversation state from the seeded.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'XmtpNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.XmtpNetwork>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import XmtpNetworkView from '$/views/XmtpNetworkView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					protocolName: true,
					scope: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.XmtpNetwork}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(xmtpNetworks)}
			{@const uniqueXmtpNetworks = [...new Map(xmtpNetworks.values.map((xmtpNetwork) => [xmtpNetwork[EntityMetaKey.SelectorKey], xmtpNetwork])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.XmtpNetwork}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={xmtpNetworks.totalCount}
				getKey={(xmtpNetwork) => xmtpNetwork[EntityMetaKey.SelectorKey]}
				items={uniqueXmtpNetworks}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No XMTP yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: xmtpNetwork })}
					{@const xmtpNetworkFields = { ...xmtpNetwork[EntityMetaKey.Selector], ...xmtpNetwork }}
					{@const selection = select(EntityType.XmtpNetwork, xmtpNetwork[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const xmtpNetworkHrefFields = { ...xmtpNetwork, ...xmtpNetwork[EntityMetaKey.Selector] }}
					<XmtpNetworkView
						selection={selection}
						prefetched={xmtpNetworkFields}
						href={(xmtpNetwork[EntityMetaKey.Selector].scope === 'XmtpNetwork' ? resolve('/xmtp') : undefined)}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.XmtpNetwork}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
