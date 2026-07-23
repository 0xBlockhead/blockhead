<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Litecoin MWEB outputs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LitecoinMwebOutputs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.LitecoinMwebOutput>
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

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LitecoinMwebOutput}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				commitment: true,
				outputIndex: true,
				$transaction: {
					fields: {
						$mwebBlock: {
							fields: {
								$block: {
									fields: {
										hash: true,
										transactionCount: true,
									},
								},
								hogExTransactionId: true,
								kernelRoot: true,
							},
						},
						kernelOffset: true,
					},
				},
			},
		})
	}
	{countResource}
	getResourceItems={(litecoinMwebOutputs) => [...new Map(litecoinMwebOutputs.values.map((litecoinMwebOutput) => [litecoinMwebOutput[EntityMetaKey.SelectorKey], litecoinMwebOutput])).values()]}
	getKey={(litecoinMwebOutput) => litecoinMwebOutput[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Litecoin MWEB outputs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: litecoinMwebOutput })}
		{@const litecoinMwebOutputFields = { ...litecoinMwebOutput[EntityMetaKey.Selector], ...litecoinMwebOutput }}
		<EntityView
			entityType={EntityType.LitecoinMwebOutput}
			entitySelector={litecoinMwebOutput[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((litecoinMwebOutputFields.commitment) ?? '')].filter(Boolean).join(' ') || [[[(String((litecoinMwebOutputFields.$transaction.$mwebBlock.$block.height) ?? '') ? 'Block #' + String((litecoinMwebOutputFields.$transaction.$mwebBlock.$block.height) ?? '') : '') || [String((litecoinMwebOutputFields.$transaction.$mwebBlock.$block.hash) ?? '')].filter(Boolean).join(' ') || 'UTXO block'].filter(Boolean).join(' ') || 'litecoin MWEB block'].filter(Boolean).join(' ') || 'litecoin MWEB transaction'].filter(Boolean).join(' ') || 'litecoin MWEB output'}
			{/snippet}

			{#snippet Value()}
				{[String((litecoinMwebOutputFields.outputIndex) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
