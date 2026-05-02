<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import BlockheadSessionsView from '$/views/BlockheadSessionsView.svelte'
	import BlockheadSourcesView from '$/views/BlockheadSourcesView.svelte'
	import Page from '$/components/Page.svelte'
	import GlobalView from '$/views/GlobalView.svelte'
</script>


<Page>
	<GlobalView
		entityId={{}}
		title={'Manage'}
		href={resolve('/~/manage')}
	>
		{#snippet children()}
			<section>
				<BlockheadSessionsView
					entityFieldReference={{
						entityType: EntityType._Global,
						entityId: {},
						fieldName: '$$blockheadSessions',
					}}
					href={resolve('/~/manage/profiles')}
					id="manage-profiles"
					open={false}
				/>
			</section>

			<section>
				<BlockheadSourcesView
					entityFieldReference={{
						entityType: EntityType._Global,
						entityId: {},
						fieldName: '$$blockheadSources',
					}}
					href={resolve('/~/manage/sources')}
					id="manage-sources"
					open={false}
				/>
			</section>
		{/snippet}
	</GlobalView>
</Page>
