<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
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

	const selector = $derived(
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


{#if selector !== undefined}
	<ParentPageCollapsible
		href={resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]', {
			specificationRealmSlug: params.specificationRealmSlug,
		})}
		id={stringify(selector)}
	>
		{#snippet Summary({ open: _open })}
			<SpecificationRealmView
				selection={select(EntityType.SpecificationRealm, selector)}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{:else}
	{@render children()}
{/if}
