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
		'$repository',
		'remoteName',
		'source',
	],
	content: {
		dl: [
			[
				'$repository',
				'remoteName',
				'source',
				'timestampMs',
				'status',
			],
			[
				'protocolVersion',
				'advertisedRefs',
				'wantedObjects',
				'receivedObjects',
				'packfileHash',
			],
			[
				'error',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Repository',
				items: [
					{
						label: 'parent Git repository',
					},
				],
			},
			{
				label: 'Remote',
				items: [
					{
						label: 'repository remote config',
					},
				],
			},
			{
				label: 'Packfile',
				items: [
					{
						label: 'captured packfile when available',
					},
				],
			},
			{
				label: 'Raw exchange',
				items: [
					{
						label: 'protocol request/response summary',
					},
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
			selection: EntityProxyResource<typeof schema, EntityType.GitFetchObservation>
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
	entityType={EntityType.GitFetchObservation}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
