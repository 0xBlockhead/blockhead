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
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


{#key params.networkId}
	<ParentPageCollapsible
		href={resolve('/(explore)/(networks)/network/[networkId]', params)}
		id={stringify({ chainId: Number(params.networkId) })}
	>
		{#snippet Summary({ open: _open })}
			<NetworkView
				entityId={{ chainId: Number(params.networkId) }}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
