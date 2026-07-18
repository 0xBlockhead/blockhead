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
		title = 'Validators',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SolanaValidators-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.SolanaValidator>
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
	import SolanaValidatorView from '$/views/SolanaValidatorView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SolanaValidator}
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
				votePubkey: true,
				$network: true,
			},
		})
	}
	getResourceItems={(solanaValidators) => [...new Map(solanaValidators.values.map((solanaValidator) => [solanaValidator[EntityMetaKey.SelectorKey], solanaValidator])).values()]}
	getKey={(solanaValidator) => solanaValidator[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Solana validators yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: solanaValidator })}
		{@const solanaValidatorFields = { ...solanaValidator[EntityMetaKey.Selector], ...solanaValidator }}
		{@const selection = select(EntityType.SolanaValidator, solanaValidator[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const solanaValidatorHrefFields = { ...solanaValidator, ...solanaValidator[EntityMetaKey.Selector] }}
		<SolanaValidatorView
			selection={selection}
			prefetched={solanaValidatorFields}
			href={
				(solanaValidatorHrefFields.votePubkey !== undefined && solanaValidatorHrefFields.$network !== undefined && solanaValidatorHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]', {
					validatorId: String(solanaValidatorHrefFields.votePubkey ?? ''),
					network: String(caip2StringFromValue(solanaValidatorHrefFields.$network.caip2) ?? ''),
				}) : solanaValidatorHrefFields.votePubkey !== undefined && solanaValidatorHrefFields.$network !== undefined && solanaValidatorHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]', {
					validatorId: String(solanaValidatorHrefFields.votePubkey ?? ''),
					network: String(solanaValidatorHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
