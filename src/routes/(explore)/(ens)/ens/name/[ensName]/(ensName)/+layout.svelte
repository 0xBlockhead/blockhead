<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		children,
		params,
	} = $props()


	// Functions
	import { select } from '$/routes/+layout.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import EnsView from '$/views/EnsView.svelte'
</script>


{#key params.ensName}
	<ParentPageCollapsible
		href={resolve('/(explore)/(ens)/ens/name/[ensName]', params)}
		id={stringify({ name: params.ensName })}
	>
		{#snippet Summary({ open: _open })}
			<EnsView
				selection={
					select(
						EntityType.EnsName,
						{ name: params.ensName }
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
