<script lang="ts">
	// Types/constants
	import { EntityLayout } from '$/components/EntityView.svelte'
	import {
		proposalCategoryBySlug,
		proposalKindAllowedInRealm,
		proposalRealmBySlug,
	} from '$/constants/Proposal.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
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

	const entityId = $derived(
		realm !== undefined && category !== undefined && proposalKindAllowedInRealm(realm, category) ?
			{
				realm,
				category,
			}
		:
			undefined,
	)


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import ProposalKindView from '$/views/ProposalKindView.svelte'
</script>


{#if entityId !== undefined}
	<ParentPageCollapsible
		href={resolve(`/proposals/${params.proposalRealmSlug}/${params.proposalKindSlug}`)}
		id={stringify(entityId)}
	>
		{#snippet Summary({ open: _open })}
			<ProposalKindView
				{entityId}
				href={resolve(`/proposals/${params.proposalRealmSlug}/${params.proposalKindSlug}`)}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{:else}
	{@render children()}
{/if}

