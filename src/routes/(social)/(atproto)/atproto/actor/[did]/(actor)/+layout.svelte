<script lang="ts">
	// Types/constants
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// Props
	let { children } = $props()

	const did = $derived(
		page.params.did ?? '',
	)


	// Components
	import AtprotoActorView from '$/views/AtprotoActorView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/(social)/(atproto)/atproto/actor/[did]', {
		did: encodeURIComponent(did),
	})}
	id={did}
>
	{#snippet Summary({ open: _open })}
		<AtprotoActorView
			entityId={{ did: decodeURIComponent(did) }}
			href={resolve('/(social)/(atproto)/atproto/actor/[did]', {
				did: encodeURIComponent(did),
			})}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
