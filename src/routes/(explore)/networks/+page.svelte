<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import NetworksView from '$/views/NetworksView.svelte'
</script>


<Page>
	<NetworksView
		href={resolve('/networks')}
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$networks',
		}}
		id="networks"
	/>
</Page>
