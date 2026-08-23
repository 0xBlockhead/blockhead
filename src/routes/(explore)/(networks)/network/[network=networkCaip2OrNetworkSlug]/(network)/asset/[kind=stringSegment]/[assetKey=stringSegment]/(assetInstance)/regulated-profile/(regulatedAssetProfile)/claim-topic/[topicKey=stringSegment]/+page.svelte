<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import ClaimTopicRequirementView from '$/views/ClaimTopicRequirementView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.ClaimTopicRequirement, {
					$profile: data.selector,
					topicKey: params.topicKey,
				}))}
			<title>{data?.title ?? 'claim topic requirement'} • claim topic requirement • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'claim topic requirement'} • claim topic requirement • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.ClaimTopicRequirement, {
					$profile: data.selector,
					topicKey: params.topicKey,
				}))}

		<ClaimTopicRequirementView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
