<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.AiModelVersion, {
		$model: data.selector,
		versionId: params.versionId,
	}, {
		sources: [
			Source.HuggingFaceHub_Rest,
			Source.Mlflow_Rest,
		],
		fields: {
			revision: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AiModelVersionView from '$/views/AiModelVersionView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.versionId ?? '') || 'AI model version' : pageSelection.entitySelector.versionId || pageSelection.entity.revision || 'AI model version')} • AI model version • Blockhead</title>
</svelte:head>


<Page>
	<AiModelVersionView
		selection={pageSelection}
	/>
</Page>
