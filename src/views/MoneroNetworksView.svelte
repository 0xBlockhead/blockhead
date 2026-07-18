<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Monero networks',
		typeAnnotationParagraphs = ['Monero-specific view over a canonical Network row, with daemon RPC endpoints, node observations, and recent blocks.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'MoneroNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.MoneroNetwork>
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
	import { EntityLayout } from '$/components/EntityView.svelte'
	import MoneroNetworkView from '$/views/MoneroNetworkView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MoneroNetwork}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
			fields: {
				$network: true,
			},
		})
	}
	getResourceItems={(moneroNetworks) => [...new Map(moneroNetworks.values.map((moneroNetwork) => [moneroNetwork[EntityMetaKey.SelectorKey], moneroNetwork])).values()]}
	getKey={(moneroNetwork) => moneroNetwork[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Monero networks yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: moneroNetwork })}
		{@const moneroNetworkFields = { ...moneroNetwork[EntityMetaKey.Selector], ...moneroNetwork }}
		{@const selection = select(EntityType.MoneroNetwork, moneroNetwork[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<MoneroNetworkView
			selection={selection}
			prefetched={moneroNetworkFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
