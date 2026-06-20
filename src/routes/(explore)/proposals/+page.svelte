<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import SpecificationRealmsView from '$/views/SpecificationRealmsView.svelte'
</script>


<Page>
	<SpecificationRealmsView
			selection={select(
				EntityType._Global,
				{ scope: '$$specificationRealms' }
			).$$specificationRealms({
				sources: [
					Source.Constants_Internal,
				],
			})}
			id="proposal-realms"
			title="Proposals"
		/>
</Page>
