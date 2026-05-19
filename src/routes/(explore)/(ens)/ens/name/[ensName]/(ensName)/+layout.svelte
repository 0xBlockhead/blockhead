<script lang="ts">
	// Types/constants
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { stringify } from 'devalue'
	import { resolve } from '$app/paths'


	// State
	let {
		children,
		params,
	} = $props()


	// Components
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
				entityId={{ name: params.ensName }}
				href={resolve('/(explore)/(ens)/ens/name/[ensName]', params)}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
