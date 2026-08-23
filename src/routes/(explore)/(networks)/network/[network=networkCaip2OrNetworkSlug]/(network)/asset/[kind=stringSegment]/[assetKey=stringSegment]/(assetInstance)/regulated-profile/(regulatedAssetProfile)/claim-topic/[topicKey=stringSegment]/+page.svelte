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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.ClaimTopicRequirement, {
		$profile: data.selector,
		topicKey: params.topicKey,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ClaimTopicRequirementView from '$/views/ClaimTopicRequirementView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'claim topic requirement'} • claim topic requirement • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'claim topic requirement'} • claim topic requirement • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<ClaimTopicRequirementView
		selection={pageSelection}
	/>
	{/if}
</Page>
