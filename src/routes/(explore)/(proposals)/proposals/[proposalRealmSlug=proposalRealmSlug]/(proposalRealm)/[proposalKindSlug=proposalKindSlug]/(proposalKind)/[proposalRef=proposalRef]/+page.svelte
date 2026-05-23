<script lang="ts">
	// Types/constants
	import {
		proposalCategoryBySlug,
		proposalKindAllowedInRealm,
		proposalRealmBySlug,
	} from '$/constants/Proposal.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		params,
	} = $props()

	const realm = $derived(
		params.proposalRealmSlug in proposalRealmBySlug ?
			proposalRealmBySlug[params.proposalRealmSlug]!.id
		:
			undefined,
	)

	const category = $derived(
		params.proposalKindSlug in proposalCategoryBySlug ?
			proposalCategoryBySlug[params.proposalKindSlug]!.id
		:
			undefined,
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

	const entityId = $derived(
		realm !== undefined && category !== undefined && proposalCategory !== undefined
		&& proposalNumber !== undefined
		&& category === proposalCategory
		&& proposalKindAllowedInRealm(realm, category) ?
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
	import ProposalView from '$/views/ProposalView.svelte'
</script>


<Page>
	{#if entityId !== undefined}
		<ProposalView
			{entityId}
			href={resolve(`/proposals/${params.proposalRealmSlug}/${params.proposalKindSlug}/${params.proposalRef}`)}
			open
		/>
	{:else}
		<p role="alert">
			Invalid proposal id in URL.
		</p>
	{/if}
</Page>

