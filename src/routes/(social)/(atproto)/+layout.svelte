<script lang="ts">
	// Types/constants
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let { children } = $props()


	// Components
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
			entityId={{
				scope: 'AtprotoNetwork',
			}}
			href={resolve('/atproto')}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
