<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubActor_TimestampView from '$/views/ActivityPubActor_TimestampView.svelte'
</script>


<svelte:head>
	<title>{'ActivityPub actor observation'} • ActivityPub actor observation • Blockhead</title>
</svelte:head>


<Page>
	<ActivityPubActor_TimestampView
		selection={
			select(EntityType.ActivityPubActor_Timestamp, {
				$actor: {
					instanceOrigin: decodeURIComponent(params.instanceOrigin),
					localAccountId: params.localAccountId,
				},
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [({
					$actor: {
						instanceOrigin: decodeURIComponent(params.instanceOrigin),
						localAccountId: params.localAccountId,
					},
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}).source],
				fields: {
					followersCount: true,
					followingCount: true,
					statusesCount: true,
				},
			})
		}
	/>
</Page>
