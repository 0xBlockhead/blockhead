<script lang="ts">
	// Types/constants
	import {
		proposalCategoryBySlug,
		proposalKindAllowedInRealmByKey,
		proposalRealmBySlug,
	} from '$/constants/Proposal.ts'

	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		children,
		params,
	} = $props()

	const realm = $derived(
		proposalRealmBySlug[params.proposalRealmSlug]?.id,
	)

	const category = $derived(
		proposalCategoryBySlug[params.proposalKindSlug]?.id,
	)

	const entityId = $derived(
		realm != null && category != null && proposalKindAllowedInRealmByKey[`${realm}:${category}`] != null ?
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


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#if entityId !== undefined}
	<ParentPageCollapsible
		href={resolve(`/proposals/${params.proposalRealmSlug}/${params.proposalKindSlug}`)}
		id={stringify(entityId)}
	>
		{#snippet Summary({ open: _open })}
			<ProposalKindView
				{entityId}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{:else}
	{@render children()}
{/if}

