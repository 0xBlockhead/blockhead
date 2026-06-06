<script lang="ts">
	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()

	const did = $derived(
		page.params.did ?? '',
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
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
				entityId={
					decodeURIComponent(did).startsWith('did:') ?
						{ did: decodeURIComponent(did) }
					:
						{ handle: decodeURIComponent(did) }
				}
				layout={EntityLayout.SummaryInline}
			/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
