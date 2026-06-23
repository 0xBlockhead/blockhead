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
			{
				label: 'repository',
			},
			{
				label: 'remote name',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'repository',
					},
					{
						label: 'remote name',
					},
					'source',
					{
						label: 'timestamp',
					},
					'status',
					{
						label: 'protocol version',
					},
					{
						label: 'advertised ref count',
					},
					{
						label: 'wanted object count',
					},
					{
						label: 'received object count',
					},
					{
						label: 'packfile hash',
					},
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
