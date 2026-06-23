<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let { children } = $props()


	// Functions
	import { select } from '$/routes/+layout.svelte'


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
			selection={
				select(
					EntityType.FarcasterNetwork,
					{
						scope: 'FarcasterNetwork',
					}
				)
			}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
