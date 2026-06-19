<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let { children } = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import AtprotoView from '$/views/AtprotoView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/atproto')}
	id={stringify({
		scope: 'AtprotoNetwork',
	})}
>
	{#snippet Summary({ open: _open })}
		<AtprotoView
			selection={select(EntityType.AtprotoNetwork, {
				scope: 'AtprotoNetwork',
			})}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
