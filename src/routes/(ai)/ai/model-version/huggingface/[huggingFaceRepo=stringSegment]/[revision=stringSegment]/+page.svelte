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

	const pageSelection = $derived(select(EntityType.AiModelVersion, {
		huggingFaceRepo: params.huggingFaceRepo,
		revision: params.revision,
	}, {
		sources: [
			Source.HuggingFaceHub_Rest,
			Source.Mlflow_Rest,
		],
		fields: {
			versionId: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AiModelVersionView from '$/views/AiModelVersionView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.revision ?? '') || 'AI model version' : (pageSelection.entity.versionId ?? '') || (pageSelection.entitySelector.revision ?? '') || 'AI model version'} • AI model version • Blockhead</title>
</svelte:head>


<Page>
	<AiModelVersionView
		selection={pageSelection}
	/>
</Page>
