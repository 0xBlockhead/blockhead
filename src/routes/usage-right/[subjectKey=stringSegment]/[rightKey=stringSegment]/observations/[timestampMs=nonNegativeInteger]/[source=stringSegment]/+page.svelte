<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import UsageRight_TimestampView from '$/views/UsageRight_TimestampView.svelte'
</script>


<svelte:head>
	<title>usage right timestamp • usage right timestamp • Blockhead</title>
</svelte:head>


<Page>
	<UsageRight_TimestampView
		selection={
			select(EntityType.UsageRight_Timestamp, {
				subjectKey: params.subjectKey,
				rightKey: params.rightKey,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
