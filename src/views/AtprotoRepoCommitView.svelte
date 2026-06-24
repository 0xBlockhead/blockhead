<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		closed: [
			'repoDid',
			'rev',
			'source',
		],
		content: {
			dl: [
				[
					'repoDid',
					'rev',
					'source',
					'commitCid',
					'previousRev',
					'previousDataCid',
					'dataCid',
					'sequence',
					'pdsHost',
					'relayHost',
					'time',
					'tooBig',
					'rebase',
					'operationCount',
					'blobCount',
					'carByteLength',
					'operationPaths',
					'createdRecordCids',
					'updatedRecordCids',
					'deletedRecordPaths',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'posts',
					when: 'open',
					items: [
						'$$posts',
					],
				},
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.AtprotoRepoCommit>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.AtprotoRepoCommit}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
