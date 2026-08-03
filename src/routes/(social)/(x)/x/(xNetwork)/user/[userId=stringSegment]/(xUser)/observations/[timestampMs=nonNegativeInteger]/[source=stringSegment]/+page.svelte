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
	import XUser_TimestampView from '$/views/XUser_TimestampView.svelte'
</script>


<svelte:head>
	<title>X user observation • X user observation • Blockhead</title>
</svelte:head>


<Page>
	<XUser_TimestampView
		selection={
			select(EntityType.XUser_Timestamp, {
				$user: {
					id: params.userId,
				},
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [({
					$user: {
						id: params.userId,
					},
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}).source],
			})
		}
	/>
</Page>
