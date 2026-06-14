<script lang="ts">
	// Types/constants
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let { children } = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import FarcasterView from '$/views/FarcasterView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/farcaster')}
	id={stringify({
		scope: 'FarcasterNetwork',
	})}
>
	{#snippet Summary({ open: _open })}
		<FarcasterView
			selector={{
				scope: 'FarcasterNetwork',
			}}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
