<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { proposalCategoryById, proposalCategoryBySlug, specificationRealmById, specificationRealmBySlug } from '$/constants/SpecificationProposal.ts'
	import { defaultSpecificationProposalSources, specificationProposalSourceSelectionByKey } from '$/sources/$sourceSelections.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageEntitySelector = $derived({
		realm: specificationRealmBySlug[params.specificationRealmSlug].id,
		category: proposalCategoryBySlug[params.proposalKindSlug].id,
		number: Number(params.proposalRef.slice(params.proposalRef.lastIndexOf('-') + 1)),
	})
	const pageSelection = $derived(select(EntityType.SpecificationProposal, pageEntitySelector, {
		sources: specificationProposalSourceSelectionByKey[[String(pageEntitySelector.realm), String(pageEntitySelector.category)].join(':')] ?? defaultSpecificationProposalSources,
		fields: {
			documentTitle: true,
			documentCategory: true,
			documentStatus: true,
			documentBody: true,
		},
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? [[
			[(String((proposalCategoryById[String(pageSelection.entitySelector.category)]?.label ?? (String((pageSelection.entitySelector.category) ?? ''))) ?? '') ? String((proposalCategoryById[String(pageSelection.entitySelector.category)]?.label ?? (String((pageSelection.entitySelector.category) ?? ''))) ?? '') + '-' : ''), String((pageSelection.entitySelector.number) ?? '')].filter(Boolean).join(''),
			String((pageSelection.entitySelector.documentTitle) ?? ''),
		].filter(Boolean).join(': ')].filter(Boolean).join(' ') || [[
			[String((proposalCategoryById[String(pageSelection.entitySelector.category)]?.label ?? (String((pageSelection.entitySelector.category) ?? ''))) ?? '')].filter(Boolean).join(''),
			String((pageSelection.entitySelector.number) ?? ''),
		].filter(Boolean).join('-')].filter(Boolean).join(' ') || 'Specification proposal' : [[
			[(String((proposalCategoryById[String(({ ...pageSelection.entitySelector, ...pageSelection.entity }).category)]?.label ?? (String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).category) ?? ''))) ?? '') ? String((proposalCategoryById[String(({ ...pageSelection.entitySelector, ...pageSelection.entity }).category)]?.label ?? (String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).category) ?? ''))) ?? '') + '-' : ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).number) ?? '')].filter(Boolean).join(''),
			String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).documentTitle) ?? ''),
		].filter(Boolean).join(': ')].filter(Boolean).join(' ') || [[
			[String((proposalCategoryById[String(({ ...pageSelection.entitySelector, ...pageSelection.entity }).category)]?.label ?? (String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).category) ?? ''))) ?? '')].filter(Boolean).join(''),
			String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).number) ?? ''),
		].filter(Boolean).join('-')].filter(Boolean).join(' ') || 'Specification proposal'))


	// Components
	import Page from '$/components/Page.svelte'
	import SpecificationProposalView from '$/views/SpecificationProposalView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Specification proposal • Blockhead</title>
</svelte:head>


<Page>
	<SpecificationProposalView
		href={
			resolve('/proposals/[specificationRealmSlug=specificationRealmSlug]/[proposalKindSlug=proposalKindSlug]/[proposalRef=proposalRef]', {
				specificationRealmSlug: params.specificationRealmSlug,
				proposalKindSlug: params.proposalKindSlug,
				proposalRef: params.proposalRef,
			})
		}
		selection={pageSelection}
	/>
</Page>
