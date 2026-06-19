<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()

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
			selection={select(EntityType.ActivityPubActor, {
				instanceOrigin: decodeURIComponent(instanceOrigin),
				localAccountId: decodeURIComponent(localAccountId),
			})}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
