<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import SpecificationRealmsView from '$/views/SpecificationRealmsView.svelte'
</script>


<Page>
	<SpecificationRealmsView
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$specificationRealms',
		}}
		id="proposal-realms"
		title="Proposals"
	/>
</Page>
