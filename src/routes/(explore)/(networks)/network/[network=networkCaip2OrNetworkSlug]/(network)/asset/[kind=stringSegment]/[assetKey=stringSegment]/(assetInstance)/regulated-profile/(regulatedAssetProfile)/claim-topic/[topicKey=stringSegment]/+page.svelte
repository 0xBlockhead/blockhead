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
	import ClaimTopicRequirementView from '$/views/ClaimTopicRequirementView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'claim topic requirement'} • claim topic requirement • Blockhead</title>
</svelte:head>


<Page>
	<ClaimTopicRequirementView
		selection={
			select(EntityType.ClaimTopicRequirement, {
				$profile: data.selector,
				topicKey: params.topicKey,
			})
		}
	/>
</Page>
