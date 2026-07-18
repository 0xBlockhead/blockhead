<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'User operations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmUserOperations-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EvmUserOperation>
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
	import EvmUserOperationView from '$/views/EvmUserOperationView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#snippet ModelTypeAnnotationTooltip()}
	<p>
		ERC-4337 user operations are intent objects bundlers include in transactions to the entry point.
	</p>
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmUserOperation}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
	resource={
		selection({
			fields: {
				hash: true,
				successful: true,
				$network: true,
			},
			limit: 16,
		})
	}
	getResourceItems={(evmUserOperations) => [...new Map(evmUserOperations.values.map((evmUserOperation) => [evmUserOperation[EntityMetaKey.SelectorKey], evmUserOperation])).values()]}
	getKey={(evmUserOperation) => evmUserOperation[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No User operations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmUserOperation })}
		{@const evmUserOperationFields = { ...evmUserOperation[EntityMetaKey.Selector], ...evmUserOperation }}
		{@const selection = select(EntityType.EvmUserOperation, evmUserOperation[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const evmUserOperationHrefFields = { ...evmUserOperation, ...evmUserOperation[EntityMetaKey.Selector] }}
		<EvmUserOperationView
			selection={selection}
			prefetched={evmUserOperationFields}
			href={
				(evmUserOperationHrefFields.hash !== undefined && evmUserOperationHrefFields.$network !== undefined && evmUserOperationHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/user-operation/[userOperationHash=userOperationHash]', {
					userOperationHash: String(evmUserOperationHrefFields.hash ?? ''),
					network: String(caip2StringFromValue(evmUserOperationHrefFields.$network.caip2) ?? ''),
				}) : evmUserOperationHrefFields.hash !== undefined && evmUserOperationHrefFields.$network !== undefined && evmUserOperationHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/user-operation/[userOperationHash=userOperationHash]', {
					userOperationHash: String(evmUserOperationHrefFields.hash ?? ''),
					network: String(evmUserOperationHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
