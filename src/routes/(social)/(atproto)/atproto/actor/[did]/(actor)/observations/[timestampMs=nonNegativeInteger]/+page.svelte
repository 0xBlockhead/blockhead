<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoActor_TimestampView from '$/views/AtprotoActor_TimestampView.svelte'
</script>


<Page>
	<AtprotoActor_TimestampView
		href={
			resolve('/(social)/(atproto)/atproto/actor/[did]/(actor)/observations/[timestampMs=nonNegativeInteger]', {
				did: params.did,
				timestampMs: params.timestampMs,
			})
		}
		selection={
			select(EntityType.AtprotoActor_Timestamp, {
				$actor: {
					did: decodeURIComponent(params.did),
				},
				timestampMs: Number(params.timestampMs),
			}, {
				fields: {
					followersCount: true,
					followsCount: true,
					postsCount: true,
				},
			})
		}
	/>
</Page>
