<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		params,
	} = $props()

	const entityId = $derived({
		instanceOrigin: decodeURIComponent(params.instanceOrigin),
		localAccountId: decodeURIComponent(params.localAccountId),
	})


	// Components
	import ActivityPubMastodonFieldNotes from '$/views/ActivityPubMastodonFieldNotes.svelte'
	import Page from '$/components/Page.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
	<ActivityPubMastodonFieldNotes
		entityFieldReference={{
			entityType: EntityType.ActivityPubActor,
			entityId,
			fieldName: '$$notes',
		}}
		href={resolve('/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]/(actor)/notes', {
			instanceOrigin: encodeURIComponent(entityId.instanceOrigin),
			localAccountId: encodeURIComponent(entityId.localAccountId),
		})}
		id="activitypub-actor-notes"
		orderByCreatedAt="desc"
		placeholderText="Loading statuses…"
		title="Statuses"
	/>
</Page>
