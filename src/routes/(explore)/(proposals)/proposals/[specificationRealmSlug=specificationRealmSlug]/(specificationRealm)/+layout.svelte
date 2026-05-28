<script lang="ts">
	// Types/constants
	import { specificationRealmBySlug } from '$/constants/SpecificationProposal.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		children,
		params,
	} = $props()

	const entityId = $derived(
		params.specificationRealmSlug in specificationRealmBySlug ?
			{
				realm: specificationRealmBySlug[params.specificationRealmSlug]!.id,
			}
		:
			undefined,
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import SpecificationRealmView from '$/views/SpecificationRealmView.svelte'
</script>


{#if entityId !== undefined}
	<ParentPageCollapsible
		href={resolve(`/proposals/${params.specificationRealmSlug}`)}
		id={stringify(entityId)}
	>
		{#snippet Summary({ open: _open })}
			<SpecificationRealmView
				{entityId}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{:else}
	{@render children()}
{/if}
