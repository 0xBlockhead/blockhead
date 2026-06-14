<script lang="ts">
	// Types/constants
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		children,
		params,
	} = $props()


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import EnsView from '$/views/EnsView.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#key params.ensName}
	<ParentPageCollapsible
		href={resolve('/(explore)/(ens)/ens/name/[ensName]', params)}
		id={stringify({ name: params.ensName })}
	>
		{#snippet Summary({ open: _open })}
			<EnsView
				selector={{ name: params.ensName }}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
