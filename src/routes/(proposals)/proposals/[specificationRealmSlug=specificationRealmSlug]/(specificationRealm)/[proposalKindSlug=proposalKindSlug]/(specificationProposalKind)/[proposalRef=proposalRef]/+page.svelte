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


	// Components
	import Page from '$/components/Page.svelte'
	import SpecificationProposalView from '$/views/SpecificationProposalView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? [[
			[String((proposalCategoryById[String(pageEntitySelector.category)]?.label ?? (String((pageEntitySelector.category) ?? ''))) ?? '')].filter(Boolean).join(''),
			String((pageEntitySelector.number) ?? ''),
		].filter(Boolean).join('-')].filter(Boolean).join(' ') || 'Specification proposal' : [[
			[(String((proposalCategoryById[String(({ ...pageEntitySelector, ...pageSelection.entity }).category)]?.label ?? (String((({ ...pageEntitySelector, ...pageSelection.entity }).category) ?? ''))) ?? '') ? String((proposalCategoryById[String(({ ...pageEntitySelector, ...pageSelection.entity }).category)]?.label ?? (String((({ ...pageEntitySelector, ...pageSelection.entity }).category) ?? ''))) ?? '') + '-' : ''), String((({ ...pageEntitySelector, ...pageSelection.entity }).number) ?? '')].filter(Boolean).join(''),
			String((({ ...pageEntitySelector, ...pageSelection.entity }).documentTitle) ?? ''),
		].filter(Boolean).join(': ')].filter(Boolean).join(' ') || [[
			[String((proposalCategoryById[String(({ ...pageEntitySelector, ...pageSelection.entity }).category)]?.label ?? (String((({ ...pageEntitySelector, ...pageSelection.entity }).category) ?? ''))) ?? '')].filter(Boolean).join(''),
			String((({ ...pageEntitySelector, ...pageSelection.entity }).number) ?? ''),
		].filter(Boolean).join('-')].filter(Boolean).join(' ') || 'Specification proposal')} • Specification proposal • Blockhead</title>
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
