<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.ActivityPubActor, {
		instanceOrigin: decodeURIComponent(params.instanceOrigin),
		acct: params.acct,
	}, {
		sources: [
			Source.Mastodon_Rest,
		],
		fields: {
			displayName: true,
			username: true,
			localAccountId: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubActorView from '$/views/ActivityPubActorView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.acct ?? '') || 'ActivityPub actor' : [(pageSelection.entity.displayName ?? ''), pageSelection.entitySelector.acct, (pageSelection.entity.username ?? ''), pageSelection.entity.localAccountId].filter(Boolean).join(' ') || 'ActivityPub actor'} • ActivityPub actor • Blockhead</title>
</svelte:head>


<Page>
	<ActivityPubActorView
		selection={pageSelection}
	/>
</Page>
