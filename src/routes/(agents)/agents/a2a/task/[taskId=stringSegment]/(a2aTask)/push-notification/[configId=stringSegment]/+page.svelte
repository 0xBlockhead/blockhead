<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import A2aPushNotificationConfigView from '$/views/A2aPushNotificationConfigView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.A2aPushNotificationConfig, {
				$task: data.selector,
				configId: params.configId,
			}, {
				sources: [],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.configId || 'A2A push notification config')} • A2A push notification config • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'A2A push notification config'} • A2A push notification config • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.A2aPushNotificationConfig, {
				$task: data.selector,
				configId: params.configId,
			}, {
				sources: [],
			})}

	<A2aPushNotificationConfigView
		selection={pageSelection}
	/>
	{/if}
</Page>
