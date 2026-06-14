<script lang="ts">
	// Types/constants
	import {
		proposalCategoryBySlug,
		proposalKindAllowedInRealmByKey,
		specificationRealmBySlug,
	} from '$/constants/SpecificationProposal.ts'


	// State
	let {
		params,
	} = $props()

	const realm = $derived(
		specificationRealmBySlug[params.specificationRealmSlug]?.id,
	)

	const category = $derived(
		proposalCategoryBySlug[params.proposalKindSlug]?.id,
	)

	const proposalNumber = $derived(
		(() => {
			const raw = params.proposalRef.slice(params.proposalRef.lastIndexOf('-') + 1)
			return /^\d+$/.test(raw) ? Number(raw) : undefined
		})(),
	)

	const proposalCategory = $derived(
		(() => {
			const raw = params.proposalRef.slice(0, params.proposalRef.lastIndexOf('-')).toLowerCase()
			return proposalCategoryBySlug[raw]?.id ?? undefined
		})(),
	)

	const entitySelector = $derived(
		realm != null && category != null && proposalCategory != null
		&& proposalNumber != null
		&& category === proposalCategory
		&& proposalKindAllowedInRealmByKey[`${realm}:${category}`] != null ?
			{
				realm,
				category,
				number: proposalNumber,
			}
		:
			undefined,
	)


	// Components
	import Page from '$/components/Page.svelte'
	import ProposalView from '$/views/SpecificationProposalView.svelte'
</script>


<Page>
	{#if entitySelector !== undefined}
		<ProposalView
			selector={entitySelector}
			open
		/>
	{:else}
		<p role="alert">
			Invalid proposal id in URL.
		</p>
	{/if}
</Page>
