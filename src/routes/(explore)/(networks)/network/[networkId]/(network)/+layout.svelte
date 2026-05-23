<script lang="ts">
	// Types/constants
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import { stringify } from 'devalue'
	import { resolve } from '$app/paths'
	import NetworkView from '$/views/NetworkView.svelte'


	// Props
	let {
		children,
		params,
	} = $props()
</script>


{#key params.networkId}
	<ParentPageCollapsible
		href={resolve('/(explore)/(networks)/network/[networkId]', params)}
		id={stringify({ chainId: Number(params.networkId) })}
	>
		{#snippet Summary({ open: _open })}
			<NetworkView
				entityId={{ chainId: Number(params.networkId) }}
				href={resolve('/(explore)/(networks)/network/[networkId]', params)}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
