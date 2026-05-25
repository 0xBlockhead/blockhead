<script lang="ts">
	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// Props
	let { children } = $props()


	// (Derived)
	const instanceOrigin = $derived(
		page.params.instanceOrigin ?? '',
	)

	const localAccountId = $derived(
		page.params.localAccountId ?? '',
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ActivityPubActorView from '$/views/ActivityPubActorView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]', {
		instanceOrigin: encodeURIComponent(instanceOrigin),
		localAccountId: encodeURIComponent(localAccountId),
	})}
	id={`${instanceOrigin}:${localAccountId}`}
>
	{#snippet Summary({ open: _open })}
		<ActivityPubActorView
			entityId={{
				instanceOrigin: decodeURIComponent(instanceOrigin),
				localAccountId: decodeURIComponent(localAccountId),
			}}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
