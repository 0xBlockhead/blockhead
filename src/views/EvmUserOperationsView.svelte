<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmUserOperation>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
			sources: selection.sources ?? [
				Source.Blockscout_Rest,
			],
			fields: {
				hash: true,
				successful: true,
				$network: true,
			},
			limit: 16,
		})
	}
	{countResource}
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
		<EntityView
			entityType={EntityType.EvmUserOperation}
			entitySelector={evmUserOperation[EntityMetaKey.Selector]}
			href={
				(
					evmUserOperation[EntityMetaKey.Selector] != null && 'hash' in evmUserOperation[EntityMetaKey.Selector]
					&& evmUserOperation[EntityMetaKey.Selector].hash != null
					&& evmUserOperation[EntityMetaKey.Selector] != null && '$network' in evmUserOperation[EntityMetaKey.Selector] ?
						evmUserOperation[EntityMetaKey.Selector].$network != null && 'caip2' in evmUserOperation[EntityMetaKey.Selector].$network
						&& evmUserOperation[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/user-operation/[userOperationHash=userOperationHash]', {
						userOperationHash: String(evmUserOperation[EntityMetaKey.Selector].hash ?? ''),
						network: String(caip2StringFromValue(evmUserOperation[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							evmUserOperation[EntityMetaKey.Selector].$network != null && 'slug' in evmUserOperation[EntityMetaKey.Selector].$network
							&& evmUserOperation[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/user-operation/[userOperationHash=userOperationHash]', {
							userOperationHash: String(evmUserOperation[EntityMetaKey.Selector].hash ?? ''),
							network: String(evmUserOperation[EntityMetaKey.Selector].$network.slug ?? ''),
						})
						:
							undefined
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((evmUserOperationFields.hash) ?? '')].filter(Boolean).join(' ') || 'User operation'}
			{/snippet}

			{#snippet Value()}
				{[String((evmUserOperationFields.hash) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((evmUserOperationFields.successful) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
